
function registeredOnly(req, res, next) {
  // for routes that require a user to be logged in and valid
  if(req.session?.loggedIn) {
    next();
  } else {
    res.status(401).redirect("/");
  }
}

function checkActiveGame(req, res, next) {
  // for routes that require a game to be active
  if(req.session.runid) {
    next()
  } else {
    res.redirect("/run");
  }
}

module.exports = {
  registeredOnly,
  checkActiveGame
};