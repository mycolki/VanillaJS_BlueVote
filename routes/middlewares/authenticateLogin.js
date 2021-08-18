function showLoginPageNotLoginUser(req, res, next) {
  console.log('인증' + req.isAuthenticated())
  if (!req.isAuthenticated()) {
    console.log('redirect')
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
