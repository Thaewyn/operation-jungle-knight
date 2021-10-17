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
   * Run Routes
   */
  app.get("/run", function(req,res) {
    // redirect based on current run state of sesion user
  });
  app.get("/run/history", function(req,res) {
    //get run history
    res.sendFile(path.join(__dirname, '../pages/history.html'))
  });
  app.get("/run/server", function(req,res) {
    //select server to approach
    res.sendFile(path.join(__dirname, '../pages/select.html'))
  });
  app.post("/run/server/:id", function(req,res) {
    //player selects a server to approach. Handle as appropriate.
  })
  app.get("/run/encounter", function(req,res) {
    res.sendFile(path.join(__dirname, '../pages/encounter.html'))
  });
  app.get("/run/encounter/log", function(req,res) {
    //get data for current run encounter. send json
  });
  app.post("/run/encounter/turn", function(req,res) {
    //player submits their turn end data. Handle as appropriate.
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