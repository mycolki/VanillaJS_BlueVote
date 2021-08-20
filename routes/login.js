const express = require('express');
const router = express.Router();

const loginController = require('./controllers/loginController');
const { LOGIN } = require('../constants/route')

router.get(LOGIN.BASE, loginController.viewLoginPage);
router.post(LOGIN.BASE, loginController.authenticateUser);

module.exports = router;
