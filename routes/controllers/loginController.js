const passport = require('passport');
const createError = require('http-errors');

const { SERVER_ERROR } = require('../../constants/errorMessage');
const { ROUTE } = require('../../constants/route');
const VIEW = require('../../constants/view');

exports.viewLoginPage = function (req, res, next) {
  res.render(VIEW.LOGIN);
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

        return next(createError(500, SERVER_ERROR));
      }

      if (!user) {
        return res
          .status(400)
          .render(VIEW.LOGIN, { message });
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(createError(500, SERVER_ERROR));
        }

        res.redirect(ROUTE.MAIN);
      });
  })(req, res, next);
};
