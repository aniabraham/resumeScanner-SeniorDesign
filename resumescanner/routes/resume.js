var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var verifyToken = require('../middleware/verify');
var jwt = require('jsonwebtoken');
var Resume = require('../models/resumes');

mongoose.connect('mongodb://127.0.0.1:27017/resumes');

// These handle the different kinds of queries that will be made
handleGPA = function(key, val, query) {
    query[key] = {$gt: parseFloat(val)};
}

handleKeyword = function(key, val, query) {
    regexVals = [];
    for (value in val) {
        regexVals.push(new RegExp(val[value], 'i'));
    }
    query[key] = {$in: regexVals};
}

handleGeneral = function(key, val, query) {
    query[key] = new RegExp(val, 'i');
}

var types = {
    'education.gpa': handleGPA,
    'keywords': handleKeyword,
    'name': handleGeneral,
    '_id': handleGeneral
};

// type term
/* GET users listing. */
router.post('/search', verifyToken, function(req, res, next) {
  
    jwt.verify(req.token, 'bananabread', (err, authData) => {
    if(err)
        res.sendStatus(403);

    else {
        let query = {};
        
        // if the body contains an accepted key, use that key's
        // handler to add its value to the query
        for (key in req.body) {
            if (key in types)
                types[key](key, req.body[key], query);
        }
        
        mongoose.model('resumes').find(query, function(err, result) {
        return res.json({
            results: result
        });

        if (err) {
            return res.json(err);
        }
        });
    }
  });
});

module.exports = router;
