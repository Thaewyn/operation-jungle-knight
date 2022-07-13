const path = require('path');
const auth = require('../util/auth');

module.exports = function(app) {
  app.get("/", function(req,res) {
    if(req.session?.loggedIn) {
      res.redirect("/menu");
    } else {
      res.sendFile(path.join(__dirname, '../pages/index.html'));
    }
    //console.log("getting root");
    //let data = false;
    //res.render("menu", data);
  });
  app.get("/menu", auth.registeredOnly, function(req,res) {
    //main menu
    res.sendFile(path.join(__dirname, '../pages/menu.html'));
  });
  app.get("/account/create", function(req,res) {
    res.sendFile(path.join(__dirname, '../pages/createaccount.html'))
  })

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
    if(req.session && req.session.runid) {
      //no idea if this will be a problem, but we should only redirect if the session has a run id
      // we should also DEFINITELY verify that the run id is both valid and active and matches the user before anything else.
      res.redirect('/run/server');
    } else {
      //new run.
      res.sendFile(path.join(__dirname, '../pages/newrun.html'));
    }
  });
  app.get("/run/history", auth.registeredOnly, function(req,res) {
    //get run history
    res.sendFile(path.join(__dirname, '../pages/history.html'))
  });
  app.get("/run/server", auth.checkActiveGame, function(req,res) {
    //select server to approach
    res.sendFile(path.join(__dirname, '../pages/select.html'))
  });
  app.get("/run/encounter", auth.checkActiveGame, function(req,res) {
    res.sendFile(path.join(__dirname, '../pages/encounter.html'))
  });
  app.get("/run/encounter/log", auth.checkActiveGame, function(req,res) {
    //get data for current run encounter. send json
  });
  app.get("/run/encounter/rewards", auth.checkActiveGame, function(req,res) {
    //encounter victory reward selection screen
    res.sendFile(path.join(__dirname, '../pages/rewards.html'))
  })
  app.get("/run/gameover", auth.checkActiveGame, function(req,res) {
    // game ended, either in success or failure.
    res.sendFile(path.join(__dirname, '../pages/runover.html'));
  })

  /**
   * Player routes
   */
  app.get("/player", auth.checkActiveGame, function(req,res) {
    res.sendFile(path.join(__dirname, '../pages/player.html'))
  });
  app.get("/player/stats", auth.checkActiveGame, function(req,res) {
    // get player statistics, send json
  });
  app.get("/player/software", auth.checkActiveGame, function(req,res) {
    // get player software data, send json
  });
  app.get("/player/hardware", auth.checkActiveGame, function(req,res) {
    // get player hardware data, send json
  });

}