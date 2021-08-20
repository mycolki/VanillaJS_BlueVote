const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const votingsController = require('./controllers/votingsController');
const validateObjectId = require('./middlewares/validateObjectId');

const { VOTINGS } = require('../constants/route');

router.get(VOTINGS.NEW, votingsController.viewNewVotingPage);
router.get(VOTINGS.SUCCESS, votingsController.viewSuccessPage);

router.post(VOTINGS.NEW,
  body('title')
    .exists({ checkFalsy: true })
    .isString(),
  body('options').notEmpty(),
  body('expiredAt').exists({ checkFalsy: true }),
  votingsController.createVoting
);

router.get('/:voteId', validateObjectId, votingsController.viewSelectedVoting);
router.put('/:voteId', validateObjectId, votingsController.participateVoting);
router.delete('/:voteId', validateObjectId, votingsController.deleteVoting);

module.exports = router;
