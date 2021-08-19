function redirectLoginNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  next();
}

function redirectMainLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  next();
}

module.exports = {
  redirectLoginNotLoggedIn,
  redirectMainLoggedIn,
};
