const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const votingsController = require('./controllers/votingsController');
const validateObjectId = require('./middlewares/validateObjectId');

router.get('/new', votingsController.viewNewVotingPage);
router.get('/success', votingsController.viewSuccessPage);

router.post('/new',
  body('title').exists({ checkFalsy: true }).isString(),
  body('options').notEmpty(),
  body('expiredAt').exists({ checkFalsy: true }),
  votingsController.createVoting
);

router.get('/:id', validateObjectId, votingsController.viewSelectedVoting);
router.post('/:id', validateObjectId, votingsController.participateVoting);
router.delete('/:id', validateObjectId, votingsController.deleteVoting);

module.exports = router;
