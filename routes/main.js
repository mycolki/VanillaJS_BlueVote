const express = require('express');
const router = express.Router();

const Vote = require('../models/Vote');
const createError = require('http-errors');

router.get('/', async function (req, res, next) {
  try {
    const votes = await Vote
      .find({})
      .populate('createUser', 'email');

    return res.render('main', { votes });
  } catch (err) {
    return next(createError(500, 'Cannot read votes data'));
  }
});

module.exports = router;
