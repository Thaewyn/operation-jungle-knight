const db = require('../db');
const bcrypt = require('bcrypt');
const encounter_ref = require("../db/encounter_ref.json");

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

  getEncounterData(runid) {
    console.log("DBController.getEncounterData called")
    return new Promise((resolve, reject) => {
      let querystring = 'SELECT * FROM runencounter WHERE runid_fk = ?';
      db.query(querystring, [runid], (err, result) => {
        if (err) {
          reject(err);
        }

        resolve({
          msg: "got encounter data.",
          ice: [
            {
              id: 7,
              name: "Firewall",
              hp: 10
            },
            {
              id: 15,
              name: "Worm",
              hp: 7
            },
            {
              id: 3,
              name: "Sentry",
              hp: 15
            }
          ]
        })
      })
    })
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