const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const createError = require('http-errors');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/User');

router.get('/', function (req, res, next) {
  res.render('signUp');
});

router.post('/',
  body('email').isEmail(),
  body('password').isLength({ min: 4, max: 8 }),
  async function (req, res, next) {
    if (!req.body) {
      return res
        .status(400)
        .render('signUp', {
          message: 'email 과 password를 입력해주세요'
        });
    }

    const { email, password, checkedPassword } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const errors = validationResult(req);

    try {
      if (await User.exists({ email })) {
        return res
          .status(400)
          .render('signUp', {
            message: '이미 가입되어 있는 email입니다'
          });
      }
    } catch {
      return next(createError(500, 'Server Error'));
    }

    if (!errors.isEmpty()) {
      const invalidInputs = errors.array().map(error => error.param).join(', ');

      return res
        .status(400)
        .render('signUp', {
          message: `${invalidInputs} 형식이 잘못 되었습니다. 다시 입력해주세요.`
        });
    }

    if (password !== checkedPassword) {
      return res
        .status(400)
        .render('signUp', {
          message: '비밀번호와 확인용 비밀번호가 일치하지 않습니다.'
        });
    }

    try {
      await User.create({
        email,
        password: hashedPassword,
      });
    } catch {
      return next(createError(500, 'Server Error'));
    }

    res.redirect('/login');
});

module.exports = router;
