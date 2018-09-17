var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://127.0.0.1:27017/resumes');

// type term
/* GET users listing. */
router.get('/:type/:term', function(req, res, next) {
  let query = {};
  console.log(req.params.type + " " + req.params.term);
  query[req.params.type] = new RegExp(req.params.term, 'i');
  
  db.model('resumes').find(query, function(err, result) {
    res.json(result);

    if (err) {
      res.json(err);
    }
  });
});

module.exports = router;
