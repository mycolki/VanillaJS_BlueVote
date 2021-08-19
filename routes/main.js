const express = require('express');
const router = express.Router();

const mainController = require('./controllers/mainController');
const { filterNotExpired, filterExpired } = require('./middlewares/filterExpired');

router.get('/', mainController.viewMainPage);
router.get('/ongoing', filterNotExpired, mainController.viewFilteredVotes);
router.get('/finished', filterExpired, mainController.viewFilteredVotes);

module.exports = router;
