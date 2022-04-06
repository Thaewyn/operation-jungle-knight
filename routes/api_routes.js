const DBController = require('../controllers/db_controller');
const dbc = new DBController();
const crypt = require('crypto');

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
      crypt.createHash('sha256')
      req.session.runid = result.insertId;
      res.json({success: true, runid: result.insertId});
    }).catch((err) => {
      console.log(err);
    })
  });

  app.post("/api/run/server/:id", function(req,res) {
    //player selects a server to approach. Handle as appropriate.
    res.json({success:false, msg: "server selected: "+req.params.id})
  });
  app.get("/api/server/data", (req,res) => {
    //asynchronous function to send page data to server selection page for a single run.
    dbc.getServerSelection(req.session.userid, req.session.runid).then(result => {
      res.json(result);
    }).catch(err => {
      console.log(err);
      res.status(500);
    })
    
  })
}