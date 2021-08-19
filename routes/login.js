const express = require('express');
const router = express.Router();

const loginController = require('./controllers/loginController');

router.get('/', loginController.viewLoginPage);
router.post('/', loginController.authenticateUser);

module.exports = router;
