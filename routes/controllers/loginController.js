const passport = require('passport');
const createError = require('http-errors');

exports.viewLoginPage = function (req, res, next) {
  res.render('login');
};

exports.authenticateUser = function (req, res, next) {
  passport.authenticate(
    'local',
    function (err, user, message) {
      if (err) {
        if (err instanceof mongoose.Error.ValidationError) {
          for (field in err.errors) {
            return next(500, err.errors[field].message);
          }
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
};
