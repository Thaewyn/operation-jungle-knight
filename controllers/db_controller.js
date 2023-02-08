const db = require('../db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const encounter_ref = require("../db/encounter_ref.json");
const enemy_ref = require("../db/enemy_ref.json");
const software_ref = require("../db/software_ref.json");
const hardware_ref = require("../db/hardware_ref.json");
const enemy_attack_ref = require("../db/enemy_attack_ref.json");

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
      // console.log("NO SEED PROVIDED BY USER");
      seed = crypto.randomBytes(32).toString('hex');
    } else {
      // console.log("SEED PROVIDED BY USER");
    }
    console.log("SEED = " + seed);

    // generate hash string from seed string
    const hash = crypto.createHash('sha256').update(seed).digest('hex');
    console.log("HASH = " + hash);

    return new Promise((resolve, reject) => {
      let querystring = 'INSERT INTO run (userid_fk, seed, run_start) VALUES (?, ?, ?)'
      let q = db.query(querystring, [userid, hash, new Date()], (err, result) => {
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

  /**
   * Given the seed hash string for a given run, and a set 'fixed offset' for the function
   * (not random, the offset for something like 'select a reward' will always be the same number or generated in the same way)
   * and the maximum number of possible options to choose from, getPseudoRandom will return a number from 0-(maximum-1)
   * @param {*} hash
   * @param {*} fixedOffset
   * @param {*} maximum
   * @returns
   */
  getPseudoRandom(hash, fixedOffset, maximum) {
    // create array of pseudorandom values from hashString
    // const randomValues = hash.split('');
    // return random value using fixedOffset
    // const result = randomValues[fixedOffset];
    const subset = hash.substring(fixedOffset, fixedOffset + 3);
    const parsed = parseInt(subset, 16);
    // check if value is below 'maximum'
    const capped = parsed % maximum;
    return capped;
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
        // adjust fixedoffset to take in more inputs (number of encounters, etc)
        // fixedOffsetChange = result[0].act_num*2 - result[0]encounter_num + 7
        let encounterNum1 = this.getPseudoRandom(result[0].seed, 4, 10);
        let encounterNum2 = this.getPseudoRandom(result[0].seed, 7, 10);
        let encounterNum3 = this.getPseudoRandom(result[0].seed, 18, 10);
        // console.log("encounternum1 sample: "+encounterNum1);
        let encounters = {
          server1: encounter_ref.act_one[encounterNum1],
          server2: encounter_ref.act_one[encounterNum2],
          server3: encounter_ref.act_one[encounterNum3]
        };
        resolve(encounters);
      });
    })
  }

  /**
   *
   * @param {string} which_act expects "act_one" or "act_two", etc
   * @param {int} encounter_id the numerical id of the encounter in that act
   * @returns an array containing instances of each enemy in the encounter
   */
  populateEncounterData(which_act, encounter_id) {
    let enemies = [];
    let encounter = encounter_ref[which_act][encounter_id]
    for(const enemy_id of encounter.enemy_ids) {
      let enemy_template = enemy_ref[enemy_id]
      let new_enemy = {
        ...enemy_template,
        current_health: enemy_template.max_health,
        current_defense: enemy_template.defense,
        status_list: [],
        next_attack_intent: 0,
        enemy_attacks: []
      }
      // filter enemy_template.attack_ids to unique ids
      for(const attack_id of enemy_template.attack_ids) {
        new_enemy.enemy_attacks.push(enemy_attack_ref[attack_id]) 
        // TODO: investigate to see if this can be done more efficiently, by not duplicating attacks across multiple enemies
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
}

module.exports = DBController;