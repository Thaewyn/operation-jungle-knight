const db = require('../db');

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
    //console.log("DBController.getserverselection");
    return new Promise((resolve, reject) => {
      let querystring = 'SELECT * FROM run WHERE id = ? AND userid_fk = ?';
      db.query(querystring, [runid, userid], (err, result) => {
        if (err) {
          reject(err);
        }
        //get run seed, act number, etc
        // process run seed from appropriate data
        resolve({
          server1: {
            id:1,
            name:"test one"
          },
          server2: {
            id:2,
            name: "test B"
          },
          server3: {
            id:3,
            name: "other test"
          }
        });
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
}

module.exports = DBController;