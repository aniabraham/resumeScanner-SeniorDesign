var express = require('express');
var router = express.Router();

router.post('/new', function(req, res, next) {
  res.send('the post request was received.');
});

module.exports = router;