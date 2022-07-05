const db = require('../db');
const bcrypt = require('bcrypt');
const encounter_ref = require("../db/encounter_ref.json");
const enemy_ref = require("../db/enemy_ref.json");

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
    })
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
        status_list: []
      }
      enemies.push(new_enemy);
    }

    return enemies
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
}

module.exports = DBController;