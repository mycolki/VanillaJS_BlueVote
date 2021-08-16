const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const User = require('../models/User');

router.get('/', function (req, res, next) {
  res.render('signUp');
});

router.post('/',
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 16 }),
  function (req, res, next) {
    if (!req.body) {
      res.render('signUp', {
        message: 'email 과 password를 입력해주세요'
      });
    }

    const { email, password, checkedPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const invalidInputs = errors.array().map(error => error.param).join(', ');

      return res.render('signUp', {
        message: `${invalidInputs} 형식이 잘못 되었습니다. 다시 입력해주세요.`
      });
    }

    if (password !== checkedPassword) {
      return res.render('signUp', {
        message: '비밀번호와 확인용 비밀번호가 일치하지 않습니다.'
      });
    }

    if (User.exists({ email })) {
      return res.render('signUp', {
        message: "이미 가입되어 있는 email입니다"
      });
    }

    User.create({
      email,
      password,
    });

    res.redirect('/login');
});

module.exports = router;
