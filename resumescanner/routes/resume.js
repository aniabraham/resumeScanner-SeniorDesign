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
    'email': handleGeneral,
    'name': handleGeneral,
    '_id': handleGeneral
};

var updateValid = [
    'education.gpa', 'education.university', 'education.degree',
    'experience.company', 'experience.position', 'experience.totalExperience',
    'name', 'email', 'keywords'
]

router.get('/image/:path', verifyToken, function(req, res) {
    jwt.verify(req.token, 'bananabread', (err) => {
        if (err) 
            return res.sendStatus(403);

        else {
            let image = require('path').resolve(
                __dirname + '/../images/' + req.params.path
            );
            return res.sendFile(image)
        }
    });
});

// type term
/* GET users listing. */
router.post('/search', verifyToken, function(req, res) {
  
    jwt.verify(req.token, 'bananabread', (err, authData) => {
        if(err)
            return res.sendStatus(403);

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

router.put('/update', verifyToken, function(req, res) {

    jwt.verify(req.token, 'bananabread', (err, authData) => {
        if (err)
            res.sendStatus(403);

        else {
            
            // was working here on updating arrays of education and experience

            var updateResume = {};

            for (key in req.body) {
                console.log(key);
                console.log(updateValid.includes(key));
                if (updateValid.includes(key)) {

                    //if (key.split('.')[0] === 'education')
                    updateResume[key] = req.body[key];
                }
            }

            updateResume['date'] = Date.now();

            mongoose.model('resumes')
                .findById(req.body['id'], function(err, resume) {
                    if (err || resume === null || resume === undefined)
                        return res.json('Resume not found.');
                    
                    resume.set(updateResume);

                    console.log(updateResume);

                    resume.save( function(err, updatedResume) {
                        if (err) return res.json('error in update');

                        return res.json('Update success.');
                    });
                });
        }
    });
});

module.exports = router;
