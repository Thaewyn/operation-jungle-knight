const DBController = require('../controllers/db_controller');
const dbc = new DBController();
const crypt = require('crypto');
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

  app.get("/api/test", function(req,res) {
    console.log("get /api/test");
  });

  /**
   * Account routes
   */
  app.post("/api/login", function(req,res) {
    console.log("login attempt");
  });
  app.post("/api/logout", function(req,res) {
    console.log("logout current user");
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
      res.json({success: true, runid: result.insertId});
    }).catch((err) => {
      console.log(err);
    })
  });

  /**
   * Select a single server by id, information stored in session, maybe database?
   */
  app.post("/api/run/server/:id", function(req,res) {
    //player selects a server to approach. Handle as appropriate.
    res.json({success:false, msg: "server selected: "+req.params.id})
  });

  /**
   * Get data for the server selection page.
   */
  app.get("/api/server/data", (req,res) => {
    //asynchronous function to send page data to server selection page for a single run.
    dbc.getServerSelection(req.session.userid, req.session.runid).then(result => {
      res.json(result);
    }).catch(err => {
      console.log(err);
      res.status(500);
    })
  })

  /**
   * Get data for a single encounter, core data function for the Encounters page.
   */
  app.get("/api/encounter/data", (req,res) => {
    dbc.getEncounterData(req.session.runid).then(result => {
      res.json(result);
    }).catch(err => {
      console.log(err);
      res.status(500);
    })
  });

  /**
   * For the Encounter page, get a player's attacks and cooldown status
   */
  app.get("/api/player/attacks", (req,res) => {
    // TODO: eventually grab from data somewhere.
    res.json({
      attacks: [
        {
          id: 1,
          name: "ICE pick",
          str: 1,
          cooldown: 0
        },
        {
          id: 2,
          name: "Thumper",
          str: 3,
          cooldown: 2
        }
      ]
    })
  });

  app.post("/api/encounter/turn", function(req,res) {
    //player submits their turn end data. Handle as appropriate.
    // TODO: brief data corruption validation. Logic validation happens elsewhere.
    console.log(req.body)
    result = gc.handleCombat(req.session.userid, req.session.runid, req.body);
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
    res.json({ //FIXME: replace with actual item fetching.
      items: [
        {
          type: "hardware",
          name: "VR Gloves",
          id: 5
        },
        {
          type: "software",
          name: "Antivirus",
          id: 7
        },
        {
          type: "software",
          name: "New attack thingy",
          id: 3
        },
      ]
    })
  });

  app.post("/api/encounter/rewards/:id", function(req,res) {
    // user selected reward with id `req.params.id`
    // validate that the selected id is one of the avaialble options
    // add to user's session/run data.
    // respond to front end with success message, then front-end redirects.
    res.status(200).json({
      status: "success"
    })
  });

  app.get("/api/gameover", function(req,res) {
    //get the gameover state for the current player
    res.json({
      victory: true
    })
  })
}