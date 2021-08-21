const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcryptjs = require('bcryptjs');

const { VALIDATION } = require("../constants/uiMessage");

const User = require('../models/User');

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async function (email, password, done) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, VALIDATION.NOT_EXIST_EMAIL);
      }

      const isPasswordCorrect = await bcryptjs.compare(password, user.password);

      if (!isPasswordCorrect) {
        return done(null, false, VALIDATION.NOT_EQUAL_PW_WITH_EMAIL);
      }

      done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  }
));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(null, user);
  });
});
