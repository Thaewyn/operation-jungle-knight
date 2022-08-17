const DBController = require('../controllers/db_controller');
const dbc = new DBController();
//const crypt = require('crypto');
const GameController = require('../controllers/game_controller');
const gc = new GameController();

module.exports = function(app) {

  // function sessionPrep(req,res,next) {
  //   //make sure session has baseline before moving on.
  //   // if(!req.session.gamedata) {
  //   //   req.session.gamedata = new gd();
  //   // }
  //   next();
  // }
  // app.use(sessionPrep);

  /**
   * Account routes
   */
  app.post("/api/login", function(req,res) {
    dbc.findUserByEmail(req.body.email).then((result) => {
      if(result[0]) {
        if(dbc.validatePassword(result[0].pass, req.body.pass)) {
          req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userid = result[0].id;
            res.status(200).json({msg: "Log in success", success: "true"});
          })
        } else {
          res.status(401).json({msg: "Failed to log in."});
        }
      } else {
        res.status(401).json({msg: "Failed to log in."});
      }
    })
  });
  app.post("/api/logout", function(req,res) {
    if(req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end()
      })
    } else {
      res.status(404).end();
    }
  });
  app.post("/api/user/create", function(req,res) {
    dbc.findUserByEmail(req.body.email).then((result) => {
      if(result[0]) {
        res.status(500).json({msg:"User Create Failed."});
      } else {
        dbc.createNewUser(req.body).then((result) => {
          if(result.affectedRows) {
            req.session.save(() => {
              req.session.loggedIn = true;
              req.session.userid = result.insertId;
              res.status(200).json({created:"true"})
            })
          } else {
            res.status(500).json({msg:"User Create Failed."});
          }
        }).catch(err => {
          console.log(err);
          res.status(500).json({msg:"User Create Failed."});
        })
      }
    }).catch(err => {
      console.log(err);
      res.status(500).json({msg:"User Create Failed."});
    })
  });

  /**
   * Functional routes
   */
  app.post("/api/newrun", (req,res) => {
    // Start new run. Generate seed from incoming seed string (if any) or math.random up a fresh one.
    // expect the body to have a 'seed' property that has the value of the custom seed input (if any)
    console.log("POST newrun");
    console.log(req.body);
    dbc.startNewRun(req.session.userid, req.body.seed).then((result) => {
      console.log("new run created successfully?");
      console.log(result.insertId);
      //crypt.createHash('sha256')
      req.session.runid = result.insertId;

      req.session.player = gc.generateDefaultPlayer();

      res.json({success: true, runid: result.insertId});
    }).catch((err) => {
      console.log(err);
    })
  });
  app.get("/api/runstatus", (req, res) => {
    if(req.session?.runid) {
      res.json({active: true, runid: req.session.runid});
    } else {
      res.json({active: false});
    }
  })

  /**
   * Select a single server by id, information stored in session, maybe database?
   */
  app.post("/api/run/server/:id", function(req,res) {
    //player selects a server to approach. Handle as appropriate.
    //TODO: is the user allowed to select a server at this stage?
    req.session.encounter = dbc.populateEncounterData("act_one", req.params.id); //FIXME: get actual act name later.

    //update encounter data with player starting status.
    if(req.session?.player) {
      //we already have the player object, initialize for combat
      req.session.player = gc.initializePlayerForCombat(req.session.player);
    } else {
      //no player object, create one for first combat
      req.session.player = gc.generateDefaultPlayer();
    }

    if(req.session.encounter) {
      res.json({success:true, msg: "server selected: "+req.params.id});
    } else {
      res.json({success:false, msg: "Game error: no encounter generated."});
    }
  });

  /**
   * Get data for the server selection page.
   */
  app.get("/api/server/data", (req,res) => {
    //asynchronous function to send page data to server selection page for a single run.
    if (req.session?.userid && req.session?.runid) {
      dbc.getServerSelection(req.session.userid, req.session.runid).then(result => {
        res.json(result);
      }).catch(err => {
        console.log(err);
        res.status(500);
      })
    } else {
      res.status(400);
    }
  })

  /**
   * Get data for a single encounter, core data function for the Encounters page.
   */
  app.get("/api/encounter/data", (req,res) => {
    if(req.session?.encounter) {
      res.json(req.session.encounter);
    } else {
      res.status(400);
    }
  });

  /**
   * For the Encounter page, get a player's attacks and cooldown status
   */
  app.get("/api/player/attacks", (req,res) => {
    // TODO: eventually grab from data somewhere.
    // console.log("API route handler for player attacks");
    // console.log(req.session.player);

    if(req.session?.player) {
      let attackList = req.session.player.software_list;
      for(let i=0; i<attackList.length; i++) {
        attackList[i].data = dbc.getSoftwareDetailsById(attackList[i].id);
      }
      res.json({
        attacks: attackList
      })
    } else {
      //error, no player object to get attacks for.
      res.json({
        success:false,
        msg: "Game Error: No player object to get attacks for"
      });
    }
  });

  app.post("/api/encounter/turn", function(req,res) {
    //player submits their turn end data. Handle as appropriate.
    // TODO: brief data corruption validation. Logic validation happens elsewhere.
    console.log(req.body)
    let result = gc.handleCombat(req.session.userid, req.session.runid, req.body);
    // FIXME: DEBUG LOGIC
    if(req.session.encounters) {
      req.session.encounters += 1
      if(req.session.encounters > 1) {
        result.gameover = true
      }
    } else {
      req.session.encounters = 1
    }
    console.log("encounters:"+req.session.encounters);
    // end DEBUG LOGIC
    res.json({msg:"submitted successfully.", data: result})
  });

  app.get("/api/encounter/rewards", function(req,res) {
    //Right now, fixed item IDs, eventually generate item IDs from seed
    if(req.session?.encounter) {
      if(req.session.encounter.loot_type == "software") {
        let software_rewards = gc.generateSoftwareRewards(req.session.seed, req.session.userid);
        let items = [];
    
        for(let i=0; i<software_rewards.length; i++) {
          items.push(dbc.getSoftwareDetailsById(software_rewards[i]));
        }
    
        res.json({
          items
        })
      } else if (req.session.encounter.loot_type == "hardware") {

        let hardware_rewards = gc.generateHardwareRewards(req.session.seed, req.session.userid);
        let items = [];

        for(let i=0; i<hardware_rewards.length; i++) {
          items.push(dbc.getHardwareDetailsById(hardware_rewards[i]));
        }

        res.json({
          items
        })
      } else {
        //no reward type
        res.json({
          err: "ERR: No reward type specified for encounter."
        })
      }
    } else {
      //no encounter data
      res.json({
        err: "ERR: No encounter data for session."
      })
    }
  });

  app.post("/api/encounter/rewards/:id", function(req,res) {
    // user selected reward with id `req.params.id`
    // validate that the selected id is one of the avaialble options
    // add to user's session/run data.
    // respond to front end with success message, then front-end redirects.
    if (gc.validateRewardSelection(req.session.seed, req.session.userid, req.params.id)) {
      if(req.session.encounter.loot_type == "software") {
        req.session.player.software_list.push({
          id: req.params.id,
          cooldown: 0
        });
      } else if(req.session.encounter.loot_type == "hardware") {
        req.session.player.hardware_list.push({
          id: req.params.id
        });
      }
      res.status(200).json({
        status: "success"
      })
    } else {
      res.status(400).json({
        status: "Invalid reward id"
      })
    }
  });

  app.get("/api/gameover", function(req,res) {
    //get the gameover state for the current player
    res.json({
      victory: true
    })
  })
}