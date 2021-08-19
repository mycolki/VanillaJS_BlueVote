const express = require('express');
const router = express.Router();

const createError = require('http-errors');

const Vote = require('../models/Vote');
const User = require('../models/User');

router.get('/', async function (req, res, next) {
  const { email } = req.user;

  try {
    const { _id } = await User.findOne({ email }).exec();
    const votes = await Vote.find({ createUser: _id }).exec();

    return res.render('myVoting', {
      email,
      votes
    });
  } catch (err) {
    next(createError(500, 'Cannot read vote data'));
  }
});

module.exports = router;
