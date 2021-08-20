const express = require('express');
const router = express.Router();

const myVotingsController = require('./controllers/myVotingsController');

const { MY_VOTINGS } = require('../constants/route');

router.get(MY_VOTINGS.BASE, myVotingsController.viewMyVotingPage);

module.exports = router;
