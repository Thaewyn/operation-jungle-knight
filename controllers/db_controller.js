const db = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const encounter_ref = require("../db/encounter_ref.json");
const enemy_ref = require("../db/enemy_ref.json");
const software_ref = require("../db/software_ref.json");
const hardware_ref = require("../db/hardware_ref.json");

//console.log("for the handling of all database things.")

class DBController {
  constructor() {

  }
  /**
   * For starting a new run.
   * @param {id} userid
   * @param {string} seed
   */
  startNewRun(userid, seed) {
    //NEEDS ERROR CHECKING eventually. Don't just trust the user id.
    console.log("DBController.startNewRun");

    // check if user provided seed
    if (!seed) {
      console.log("NO SEED PROVIDED BY USER");
      seed = crypto.randomBytes(32).toString('hex');
    } else {
      console.log("SEED PROVIDED BY USER");
    }
    console.log("SEED = " + seed);

    // generate hash string from seed string
    const hash = crypto.createHash('sha256').update(seed).digest('hex');
    console.log("HASH = " + hash);

    // get pseudorandom values from hash string using fixedOffset and maximum
    const resultRandom = this.getPseudoRandom(hash, 5, 20);
    console.log("RESULTRANDOM = " + resultRandom);

    return new Promise((resolve, reject) => {
      let querystring = 'INSERT INTO run (userid_fk, seed, run_start) VALUES (?, ?, ?)'
      let q = db.query(querystring, [userid, seed, new Date()], (err, result) => {
        if (err) {
          console.log("SQL Error in DBController.startNewRun");
          reject(err);
        }
        //console.log(result);
        resolve(result);
      });
      //console.log(q.sql);
    });
  }

  // /**
  //  *
  //  * @param {*} seed
  //  * @returns
  //  */
  // generateHash(seed) {
  //   // generate hash string from seed string
  //   const hash = crypto.createHash('sha256').update(seed).digest('hex');
  //   console.log("HASH = " + hash);
  //   return hash;
  // }

  /**
   *
   * @param {*} hash
   * @param {*} fixedOffset
   * @param {*} maximum
   * @returns
   */
  getPseudoRandom(hash, fixedOffset, maximum) {
    // create array of pseudorandom values from hashString
    const randomValues = hash.split('');
    console.log("RANDOMVALUES = " + randomValues);


    // return random value using fixedOffset
    // const result = parseInt(randomValues[fixedOffset], 16);
    const result = randomValues[fixedOffset];
    console.log("RESULT = " + randomValues);
    return result;
    // TODO: check if value is below 'maximum '
  }

  /**
   * During a run, get 3 options for the next 'server' to approach
   * @param {int} userid
   * @param {int} runid
   * @returns 3 server options
   */
  getServerSelection(userid, runid) {
    console.log("DBController.getserverselection");
    console.log("userid = "+userid+", runid = "+runid);
    return new Promise((resolve, reject) => {
      let querystring = 'SELECT * FROM run WHERE id = ? AND userid_fk = ? AND is_active = 1';
      db.query(querystring, [runid, userid], (err, result) => {
        if (err) {
          reject(err);
        }
        //get run seed, act number, etc
        // process run seed from appropriate data
        //grab data from encounter_ref.json
        let encounters = {
          server1: encounter_ref.act_one[1],
          server2: encounter_ref.act_one[2],
          server3: encounter_ref.act_one[3]
        };
        resolve(encounters);
      });
    })
  }

  /**
   *
   * @param {string} which_act expects "act_one" or "act_two", etc
   * @param {int} encounter_id the numerical id of the encounter in that act
   *
   * @returns an array containing instances of each enemy in the encounter
   */
  populateEncounterData(which_act, encounter_id) {
    let enemies = [];

    let encounter = encounter_ref[which_act][encounter_id]
    for(let i=0; i<encounter.enemy_ids.length; i++) {
      let enemy_id = encounter.enemy_ids[i];
      let enemy_template = enemy_ref[enemy_id]
      let new_enemy = {
        ...enemy_template,
        current_health: enemy_template.max_health,
        current_defence: enemy_template.defence,
        status_list: [],
        next_attack_intent: enemy_template.attack_ids[0]
      }
      enemies.push(new_enemy);
    }

    encounter.enemies = enemies;
    encounter.turn = 0;

    return encounter
  }

  findUserByEmail(email) {
    // console.log("DBController.findUserByEmail called");
    return new Promise((resolve, reject) => {
      let querystring = 'SELECT * FROM users WHERE email = ?';
      db.query(querystring, [email], (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      })
    })
  }

  /**
   * createNewUser attempts to create a new user in the database, and also first encrypts the password
   * @param {Object} userobj the request body of the user to create. Must include properties user, pass, and email
   * @returns Promise containing the database insertion attempt
   */
  createNewUser(userobj) {
    return new Promise((resolve, reject) => {
      if(userobj.user && userobj.pass && userobj.email) {
        bcrypt.hash(userobj.pass, 10).then(encrypted => {
          let querystring = 'INSERT INTO users (username, pass, email) VALUES (?, ?, ?)';
          db.query(querystring, [userobj.user, encrypted, userobj.email], (err, result) => {
            if (err) {
              reject(err);
            }

            resolve(result);
          });
        })
      } else {
        reject("Could not create new user.")
      }
    })
  }

  /**
   * Attempts to validate password using bcrypt
   * @param {String} existingUserPass password of user in the database
   * @param {String} submittedPass password subbitted for login
   * @returns boolean of success or failure
   */
  validatePassword(existingUserPass, submittedPass) {
    return bcrypt.compareSync(submittedPass, existingUserPass);
  }

  /**
   * Grab all software item information from json reference file.
   * @param {Number} id
   */
  getSoftwareDetailsById(id) {
    if(software_ref[id]) {
      return software_ref[id];
    } else {
      return "ERR: No software with that ID";
    }
  }

  /**
   * Grab details of hardware item given a specific id.
   * @param {Number} id unique id of the hardware to be looked up
   * @returns json of the hardware item details
   */
  getHardwareDetailsById(id) {
    if(hardware_ref[id]) {
      return hardware_ref[id];
    } else {
      return "ERR: No hardware with that ID";
    }
  }

  // /**
  //  *
  //  * @param {*} hex
  //  * @returns
  //  */
  //  hexToDecimal(hex) {
  //   return parseInt(hex, 16);
  // }
}

module.exports = DBController;