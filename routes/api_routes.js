
module.exports = function(app) {

  function sessionPrep(req,res,next) {
    //make sure session has baseline before moving on.
    // if(!req.session.gamedata) {
    //   req.session.gamedata = new gd();
    // }
    next();
  }
  app.use(sessionPrep);

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
}