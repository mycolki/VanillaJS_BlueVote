const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const votingController = require('./controllers/votingController');

router.get('/new', votingController.viewNewVotingPage);
router.get('/success', votingController.viewSuccessPage);

router.post('/new',
  body('title').exists({ checkFalsy: true }).isString(),
  body('options').notEmpty(),
  body('expiredAt').exists({ checkFalsy: true }),
  votingController.createVoting
);

router.get('/:id', votingController.viewSelectedVoting);
router.post('/:id', votingController.participateVoting);

module.exports = router;
