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
            return next(createError(500, 'Database Error'));
          }

          next(createError(500, "Server Error"));
        }

        if (!user) {
          return res
            .status(400)
            .render('login', { message });
        }

        req.logIn(user, function (err) {
          if (err) {
            return next(createError(500, "Server Error"));
          }

          res.redirect('/');
        });
    })(req, res, next);
  }
);

module.exports = router;
