const Vote = require('../../models/Vote');
const createError = require('http-errors');

exports.viewMainPage = async function (req, res, next) {
  try {
    const votes = await Vote
      .find({})
      .populate('createUser', 'email');

    return res.render('main', { votes });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    return next(createError(500, 'Server Error'));
  }
};
