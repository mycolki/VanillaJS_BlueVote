const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  console.log("asdfsfs")
  res.render('main');
});

module.exports = router;
