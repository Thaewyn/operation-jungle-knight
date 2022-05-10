const path = require('path');

module.exports = function(app) {
  app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname, '../pages/index.html'));
    //console.log("getting root");
    //let data = false;
    //res.render("menu", data);
  });
  app.get("/menu", function(req,res) {
    //main menu
    res.sendFile(path.join(__dirname, '../pages/menu.html'))
  });

  /**
   * Session setup
   */
  // app.use((req,res,next) => {
  //   // will be called in EVERY CONTACT.
  //  check to see if runid exists, get runid
  //  check to see if seed exists, generate seed string hash
  // })

  /**
   * Run Routes
   */
  app.get("/run", function(req,res) {
    // redirect based on current run state of sesion user
    //FIXME: DEBUG ONLY
    req.session.userid = 1;
    if(req.session && req.session.runid) {
      //no idea if this will be a problem, but we should only redirect if the session has a run id
      // we should also DEFINITELY verify that the run id is both valid and active and matches the user before anything else.
      res.redirect('/run/server');
    } else {
      //new run.
      res.sendFile(path.join(__dirname, '../pages/newrun.html'));
    }
  });
  app.get("/run/history", function(req,res) {
    //get run history
    res.sendFile(path.join(__dirname, '../pages/history.html'))
  });
  app.get("/run/server", function(req,res) {
    //select server to approach
    res.sendFile(path.join(__dirname, '../pages/select.html'))
  });
  app.get("/run/encounter", function(req,res) {
    res.sendFile(path.join(__dirname, '../pages/encounter.html'))
  });
  app.get("/run/encounter/log", function(req,res) {
    //get data for current run encounter. send json
  });
  app.get("/run/encounter/rewards", function(req,res) {
    //encounter victory reward selection screen
    res.sendFile(path.join(__dirname, '../pages/rewards.html'))
  })

  /**
   * Player routes
   */
  app.get("/player", function(req,res) {
    res.sendFile(path.join(__dirname, '../pages/player.html'))
  });
  app.get("/player/stats", function(req,res) {
    // get player statistics, send json
  });
  app.get("/player/software", function(req,res) {
    // get player software data, send json
  });
  app.get("/player/hardware", function(req,res) {
    // get player hardware data, send json
  });

}