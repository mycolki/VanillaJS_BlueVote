const createError = require('http-errors');
const mongoose = require('mongoose');
const { isValid } = mongoose.Types.ObjectId

const { BAD_REQUEST } = require('../../constants/errorMessage');

const Vote = require('../../models/Vote');

async function validateObjectId(req, res, next) {
  const { voteId } = req.params;

  if (!isValid(voteId)) {
    return next(createError(400, BAD_REQUEST));
  }

  try {
    if (!await Vote.exists({ _id: voteId })) {
      return next(createError(400, BAD_REQUEST));
    }

    next();
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

module.exports = validateObjectId;
