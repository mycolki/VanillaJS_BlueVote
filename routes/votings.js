const { body, validationResult } = require('express-validator');
const createError = require('http-errors');

const express = require('express');
const router = express.Router();

const Vote = require('../models/Vote');

router.get('/', function (req, res, next) {
  res.render('votings');
});

router.get('/new', function (req, res, next) {
  res.render('newVoting');
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

      errors.array().forEach(error => {
        allErrors[error.param] = params[error.param];
      });

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
  }
);

module.exports = router;
