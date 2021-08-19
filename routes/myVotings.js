const express = require('express');
const router = express.Router();

const myVotingController = require('./controllers/myVotingController');

router.get('/', myVotingController.viewMyVotingPage);

module.exports = router;
