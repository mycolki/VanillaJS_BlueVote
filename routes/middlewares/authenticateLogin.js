function showLoginPageNotLoginUser(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  next();
}

function showMainPageLoginUser(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  next();
}

module.exports = {
  showLoginPageNotLoginUser,
  showMainPageLoginUser,
};
