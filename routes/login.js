const express = require('express');
const router = express.Router();
const passport = require('passport');

const createError = require('http-errors');

router.get('/', function (req, res, next) {
  res.render('login');
});

router.post(
  '/',
  function (req, res, next) {
    passport.authenticate(
      'local',
      function(err, user, message) {
        if (err) {
          if (err instanceof mongoose.Error.ValidationError) {
            // 어떤거 저장하다가 나온 에런지 찾아서 사용자에게 알려주기
            return res
              .status(400)
              .render('login', { message: '형식에 맞춰서 ***를 다시 입력해주세요' });
          }

          return next(createError(500, 'Server Error'));
        }

        if (!user) {
          return res
            .status(400)
            .render('login', { message });
        }

        req.logIn(user, function (err) {
          if (err) {
            return next(createError(500, 'Server Error'));
          }

          res.redirect('/');
        });
    })(req, res, next);
  }
);

module.exports = router;
