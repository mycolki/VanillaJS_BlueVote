const createError = require('http-errors');
const mongoose = require('mongoose');

const Vote = require('../../models/Vote');
const User = require('../../models/User');

const { SERVER_ERROR } = require('../../constants/errorMessage');
const { ROUTE } = require('../../constants/route');
const VIEW = require('../../constants/view');

exports.viewMyVotingPage = async function (req, res, next) {
  const { email } = req.user;

  try {
    const { _id } = await User.findOne({ email }).exec();
    const votes = await Vote.find({ createUser: _id }).exec();

    return res.render(VIEW.MY_VOTINGS, {
      email,
      votes,
    });
  } catch (err) {
    console.error(err);

    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    next(createError(500, SERVER_ERROR));
  }
};

exports.logout = function (req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect(ROUTE.LOGIN);
};
