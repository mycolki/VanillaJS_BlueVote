const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('votings');
});

router.get('/new', function (req, res, next) {
  res.render('newVoting');
});

module.exports = router;
