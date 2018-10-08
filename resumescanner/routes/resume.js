var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var verifyToken = require('../middleware/verify');
var jwt = require('jsonwebtoken');
var Resume = require('../models/resumes');

mongoose.connect('mongodb://127.0.0.1:27017/resumes');

// type term
/* GET users listing. */
router.get('/:type/:term', verifyToken, function(req, res, next) {
  
    jwt.verify(req.token, 'bananabread', (err, authData) => {
    if(err)
        res.sendStatus(403);

    else {
        let query = {};
        query[req.params.type] = new RegExp(req.params.term, 'i');
        
        mongoose.model('resumes').find(query, function(err, result) {
        return res.json({
            results: result,
            authData
        });

        if (err) {
            return res.json(err);
        }
        });
    }
  });
});

module.exports = router;
