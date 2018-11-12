const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const verifyToken = require('../middleware/verify');
const jwt = require('jsonwebtoken');
const Resume = require('../models/resumes');

const Education = new Schema({
    university: String, 
    degree: String, 
    gpa: Number
});

const Experience = new Schema({
    company: String, 
    position: String, 
    // Number of months worked
    totalExperience: Number
});

mongoose.connect('mongodb://127.0.0.1:27017/resumes');

// These handle the different kinds of queries that will be made
handleGPA = function(key, val, query) {
    query[key] = {$gt: parseFloat(val)};
}

// https://stackoverflow.com/questions/2817646
splitOnSpace = function(fullString) {
    let splitRegex = /[^\s"]+|"([^"]*)"/gi;
    let retArray = [];

    do {
        //Each call to exec returns the next regex match as an array
        let match = splitRegex.exec(fullString);
        if (match != null)
        {
            //Index 1 in the array is the captured group if it exists
            //Index 0 is the matched text, which we use if no captured group exists
            retArray.push(match[1] ? match[1] : match[0]);
        }
    } while (match != null);

    console.log(retArray);

    return retArray;
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

handleId = function(key, val, query) {
    query[key] = val;
}

var types = {
    'education.gpa': handleGPA,
    'keywords': handleKeyword,
    'email': handleGeneral,
    'name': handleGeneral,
    'phone': handleGeneral,
    '_id': handleId
};

var updateValid = [
    'education', 'experience', 'name', 'email', 'keywords', 'phone'
]

var experienceValid = ['company', 'position', 'totalExperience']
var educationValid = ['university', 'degree', 'gpa']

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

            updateResume['date'] = Date.now();

            console.log(req.body["_id"]);

            mongoose.model('resumes')
                .findById(req.body['_id'], function(err, resume) {
                    if (err || resume === null || resume === undefined)
                        return res.json('Resume not found.');
                    
                    // resume.set(updateResume);

                    // add updated parameters to model
                    // push new objects to arrays
                    // could probably use some refactoring if there's time
                    for (key in req.body) {
                        if (updateValid.includes(key)) {

                            let element = req.body[key];
                            
                            // the large amount of nesting in these for loops
                            // would generally very negatively affect runtime
                            // however, because there are never going to be
                            // a large amount of previous experiences or
                            // educations, this is not a problem.
                            if (key === 'education') {
                                for (i in element) {

                                    let edu = element[i];
                                    console.log(edu);
                                    let eduId = edu["_id"]
                                    
                                    if (eduId === "add") {
                                        edu["_id"] = mongoose.Types.ObjectId();
                                        resume.education.push(edu);
                                    }
                                    else {
                                        for (x in resume.education) {
                                            let resEdu = resume.education[x];

                                            if (eduId == resEdu["_id"]) {
                                                for (eduKey in edu) {
                                                    resume.education[x][eduKey]
                                                        = edu[eduKey];
                                                }
                                            }
                                        }
                                    }
                                }

                                console.log(resume.education);
                            }
                            else if (key === 'experience') {
                                for (i in element) {
                                    let exp = element[i];
                                    let expId = exp["_id"]
                                    if (expId === "add") {
                                        resume.experience.push(
                                            new Experience(exp)
                                        );
                                    }
                                    else {
                                        for (x in resume.experience) {
                                            let resExp = resume.experience[x];
                                            if (expId == resExp["_id"]) {
                                                for (expKey in exp) {
                                                    resume.experience[x][expKey]
                                                        = exp[expKey];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                                resume[key] = req.body[key];
                        }
                    }

                    resume.save( function(err, updatedResume) {
                        if (err) return res.json('error in update');

                        return res.json({success: true});
                    });
                });
        }
    });
});

module.exports = router;
