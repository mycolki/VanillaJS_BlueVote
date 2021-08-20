const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const { validationResult } = require('express-validator');
const createError = require('http-errors');
const isAfter = require('date-fns/isAfter');

const Vote = require('../../models/Vote');
const User = require('../../models/User');

const { VALIDATION, VOTING_COMMENT, FORMS } = require('../../constants/uiMessage');
const { SERVER_ERROR } = require('../../constants/errorMessage');
const { ROUTE, VOTINGS } = require('../../constants/route');
const VIEW = require('../../constants/view');

const forms = { title: FORMS.TITLE, expiredAt: FORMS.EXPIRED_AT, options: FORMS.OPTIONS };

exports.viewNewVotingPage = function (req, res, next) {
  res.render(VIEW.NEW_VOTING);
};

exports.viewSuccessPage = function (req, res, next) {
  const userId = req.user.email.split('@')[0];
  res.render(VIEW.SUCCESS, { userId });
};

exports.createVoting = async function (req, res, next) {
  if (!req.user) {
    alert(VALIDATION.REDIRECT_NOT_LOGGED_IN_USER);
    return res.redirect(ROUTE.LOGIN);
  }

  if (!req.body) {
    return res
      .status(400)
      .render(VIEW.NEW_VOTING, VALIDATION.FILL_ALL_BLANKS);
  }

  const { _id } = req.user;
  const { title, expiredAt, options } = req.body;

  const errors = validationResult(req);
  const optionList = [];
  const allErrors = {};

  if (!errors.isEmpty()) {
    errors.array().forEach(error => allErrors[error.param] = forms[error.param]);

    const invalidInputs = Object.values(allErrors).join(', ');

    return res
      .status(400)
      .render(VIEW.NEW_VOTING, {
        message: invalidInputs + VALIDATION.INPUT_BY_CONDITION
      });
  }

  for (const option of options) {
    if (!option) {
      return res
        .status(400)
        .render(VIEW.NEW_VOTING, VALIDATION.FILL_OPTION_BLANKS);
    }

    optionList.push({ option, votingCount: 0 });
  }

  try {
    await Vote.create({
      createUser: _id,
      title,
      expiredAt,
      options: optionList,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    return next(createError(500, SERVER_ERROR));
  }

  res.redirect(VOTINGS.ROUTE_SUCCESS);
}

exports.viewSelectedVoting = async function (req, res, next) {
  const userId = req.user._id;
  const voteId = req.params.id;
  const currentDate = new Date().toISOString();

  let isActive = false;
  let comment = VOTING_COMMENT.FIRST_VOTE;

  try {
    const vote = await Vote.findOne({ _id: voteId }).exec();
    const isParticipatedVote = await User.exists({ participatedVotings: voteId });

    let isCreateUser = false;
    let isExpired = false;

    if (String(vote.createUser) === String(userId)) {
      isCreateUser = true;
    }

    if (isParticipatedVote) {
      isActive = true;
      comment = VOTING_COMMENT.RE_VOTE;
    }

    if (isAfter(new Date(currentDate), new Date(vote.expiredAt))) {
      isExpired = true;
    }

    return res.render(VIEW.SELECTED_VOTING, {
      comment,
      id: voteId,
      vote,
      options: vote.options,
      isActive,
      isCreateUser,
      isExpired,
      isParticipatedVote,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    return next(createError(500, SERVER_ERROR));
  }
};

exports.participateVoting = async function (req, res, next) {
  const userId = req.user._id;
  const voteId = req.params.id;
  const optionId = req.body.option;

  try {
    const isParticipatedVote = await User.exists({
      participatedVotings: voteId
    });

    if (isParticipatedVote) {
      return;
    }

    await Vote.findOneAndUpdate(
      {
        _id: voteId,
        'options._id': optionId,
      },
      { $inc:
        {
          'options.$.votingCount': 1
        }
      }
    );
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    return next(createError(500, SERVER_ERROR));
  }

  try {
    await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { participatedVotings: voteId } },
    );
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    next(createError(500, SERVER_ERROR));
  }
};

exports.deleteVoting = async function (req, res, next) {
  const voteId = req.params.id;
  const userId = req.user._id;

  try {
    const { createUser } = await Vote.findById(voteId).exec();

    if (String(createUser) === String(userId)) {
      await Vote.deleteOne({ _id: voteId });
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    return next(createError(500, SERVER_ERROR));
  }

  res.redirect(ROUTE.MAIN);
};
