const createError = require('http-errors');

const Vote = require('../../models/Vote');
const User = require('../../models/User');

exports.viewMyVotingPage = async function (req, res, next) {
  const { email } = req.user;

  try {
    const { _id } = await User.findOne({ email }).exec();
    const votes = await Vote.find({ createUser: _id }).exec();

    return res.render('myVoting', {
      email,
      votes
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
