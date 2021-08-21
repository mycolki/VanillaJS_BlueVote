const createError = require('http-errors');
const mongoose = require('mongoose');

const Vote = require('../../models/Vote');

const { SERVER_ERROR } = require('../../constants/errorMessage');
const VIEW = require('../../constants/view');

exports.viewMainPage = async function (req, res, next) {
  try {
    const votes = await Vote
      .find({})
      .populate('createUser', 'email');

    return res.render(VIEW.MAIN, {
      votes,
      isFiltered: false,
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

exports.viewFilteredVotes = async function (req, res, next) {
  res.render(VIEW.MAIN, {
    votes: res.locals.filtered,
    isFiltered: true,
  });
};
