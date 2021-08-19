const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const signUpController = require('./controllers/signUpController');

router.get('/', signUpController.viewSignUpPage);

router.post('/',
  body('email').isEmail(),
  body('password').isLength({ min: 4, max: 8 }),
  signUpController.signUpNewUser
);

module.exports = router;
