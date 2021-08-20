const createError = require('http-errors');

const Vote = require('../../models/Vote');
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
    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    next(createError(500, 'Server Error'));
  }
};

exports.viewFilteredVotes = async function (req, res, next) {
  res.render(VIEW.MAIN, {
    votes: res.locals.filtered,
    isFiltered: true,
  });
};
