const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');

const User = require('../models/User');

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async function (email, password, done) {
    try {
      const user = await User.findOne({ email });
      // 이메일과 비번 모두 입력해야 로긴누를수 있게 프론트단에서 처리해주기
      if (!user) {
        return done(null, false, '입력하신 계정과 일치하는 계정이 없습니다.');
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return done(null, false, '패스워드가 일치하지 않습니다.');
      }

      done(null, user);
    } catch (err) {
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
