var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://127.0.0.1:27017/resumes');

// type term
/* GET users listing. */
router.get('/:type/:term', function(req, res, next) {
  let query = {};
  query[req.params.type] = new RegExp(req.params.term, 'i');
  
  db.model('resumes').find(query, function(err, result) {
    return res.json(result);

    if (err) {
      return res.json(err);
    }
  });
});

module.exports = router;
