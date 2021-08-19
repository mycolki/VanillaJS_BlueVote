const mongoose = require('mongoose');
const createError = require('http-errors');

const { isValid } = mongoose.Types.ObjectId

const Vote = require('../../models/Vote');

async function validateObjectId(req, res, next) {
  const { id } = req.params;

  if (!isValid(id)) {
    return next(createError(400, 'Bad Request'));
  }

  try {
    if (!await Vote.exists({ _id: id })) {
      return next(createError(400, 'Bad Request'));
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }
  }

  next();
};

module.exports = validateObjectId;
