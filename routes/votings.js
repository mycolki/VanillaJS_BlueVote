const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const createError = require('http-errors');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const Vote = require('../models/Vote');
const User = require('../models/User');

router.get('/', function (req, res, next) {
  res.render('votings');
});

router.get('/new', function (req, res, next) {
  res.render('newVoting');
});

router.get('/success', function (req, res, next) {
  const userId = req.user.email.split('@')[0];
  res.render('success', { userId });
});

router.get('/error', function (req, res, next) {
  res.render('error');
});

router.post('/new',
  body('title').exists({ checkFalsy: true }).isString(),
  body('options').isLength({ min: 2 }).notEmpty(),
  body('expiredAt').exists({ checkFalsy: true }),
  async function (req, res, next) {
    if (!req.user) {
      alert('로그인되지 않은 사용자입니다. 로그인페이지로 이동합니다');
      return res.redirect('/login');
    }

    if (!req.body) {
      return res
        .status(400)
        .render('newVoting', {
          message: '빈칸을 모두 입력하고 투표만들기 버튼을 눌러주세요'
        });
    }

    const { _id } = req.user;
    const { title, expiredAt, options } = req.body;
    const errors = validationResult(req);
    const optionList = [];
    const allErrors = {};

    if (!errors.isEmpty()) {
      const params = { title: '투표 주제', expiredAt: '투표 마감시간', options: '선택지' };
      errors.array().forEach(error => allErrors[error.param] = params[error.param]);

      const invalidInputs = Object.values(allErrors).join(', ');

      return res
        .status(400)
        .render('newVoting', {
          message: `${invalidInputs} 항목을 조건에 맞게 다시 입력해주세요.`
        });
    }

    for (const option of options) {
      if (!option) {
        return res
          .status(400)
          .render('newVoting', {
            message: '비어있는 선택지가 없도록 모두 입력해주세요'
          });
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
        // 어떤거 저장하다가 나온 에런지 찾아서 사용자에게 알려주기
        return res
          .status(400)
          .render('newVoting', { message: '형식에 맞춰서 ***를 다시 입력해주세요' });
      }

      next(createError(500, 'Server Error'));
    }

    res.redirect('/votings/success');
  }
);

router.get('/:id', async function (req, res, next) {
  const { id } = req.params;
  let isActive = false;
  let comment = '가슴에 손을 얹고 솔직하게 투표해주시기 바랍니다';

  try {
    const vote = await Vote.findOne({ _id: id }).exec();
    const isParticipatedVote = await User.exists({ participatedVotings: id });

    if (isParticipatedVote) {
      isActive = true;
      comment = '이미 참여한 투표는 재투표 할 수 없습니다';
    }

    return res.render('selectedVoting', {
      comment,
      id,
      vote,
      options: vote.options,
      isActive,
    });
  } catch (err) {
    next(createError(500, 'Cannot read vote data'));
  }
});

router.post('/:id', async function (req, res, next) {
  const voteId = req.params.id;
  const optionId = req.body.option;
  const userId = req.user._id;

  try {
    await Vote.findOneAndUpdate(
      {
        _id: voteId,
        'options._id': optionId,
      },
      { $inc:
        {
          'options.$.votingCount': 1
        }
      },
      function (err) {
        //throw err;
        console.error(err);
      }
    );
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      //
      return next(createError(500, 'Cannot read vote data'));
    }

    next(createError(500, 'Server Error'));
  }

  try {
    await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { participatedVotings: voteId } },
    );
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      //
      return next(createError(500, 'Cannot read vote data'));
    }

    next(createError(500, 'Server Error'));
  }
});

module.exports = router;
