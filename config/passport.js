const passport = require(passport);

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: true,
  },
  function (email, password, done) {
    User.findOne({ email }, authenticateUser);
  }
));

function authenticateUser(err, user) {
  if (err) {
    return done(err);
  }

  if (!user) {
    return done(null, false);
  }

  if (!user.verifyPassword(password)) {
    return done(null, false);
  }

  return done(null, user);
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
