const { ROUTE } = require('../../constants/route');

function redirectLoginNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect(ROUTE.LOGIN);
  }

  next();
}

function redirectMainLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect(ROUTE.MAIN);
  }

  next();
}

module.exports = {
  redirectLoginNotLoggedIn,
  redirectMainLoggedIn,
};
