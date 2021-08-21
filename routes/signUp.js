const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const signUpController = require('./controllers/signUpController');

const { SIGN_UP } = require('../constants/route');
const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

router.get(SIGN_UP.BASE, signUpController.viewSignUpPage);

router.post(SIGN_UP.BASE,
  body('email')
    .isEmail()
    .bail()
    .custom(val => emailRegex.test(val))
    .bail(),
  body('password')
    .isLength({ min: 4, max: 8 }),
  signUpController.signUpNewUser
);

module.exports = router;
