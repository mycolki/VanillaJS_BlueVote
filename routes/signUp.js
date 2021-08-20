const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const signUpController = require('./controllers/signUpController');

const { SIGN_UP } = require('../constants/route');

router.get(SIGN_UP.BASE, signUpController.viewSignUpPage);

router.post(SIGN_UP.BASE,
  body('email').isEmail(),
  body('password').isLength({ min: 4, max: 8 }),
  signUpController.signUpNewUser
);

module.exports = router;
