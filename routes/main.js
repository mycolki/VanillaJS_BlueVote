const express = require('express');
const router = express.Router();

const mainController = require('./controllers/mainController');
const { filterNotExpired, filterExpired } = require('./middlewares/filterExpired');

const { MAIN } = require('../constants/route');

router.get(MAIN.BASE, mainController.viewMainPage);
router.get(MAIN.ONGOING, filterNotExpired, mainController.viewFilteredVotes);
router.get(MAIN.FINISHED, filterExpired, mainController.viewFilteredVotes);

module.exports = router;
