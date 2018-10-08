var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/users');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/resumes');

authExtract = function(authToken) {
    // Extract username password

    if (authToken.split(' ')[0] !== 'Basic') {
        return res.json("The Authorization header is either empty or isn't Basic.");
    }

    let authString = authToken.split(' ')[1];

    // decode the authstring and split it into username and password
    let authUser = Buffer.from((authString), 'base64').toString().split(':')[0];
    let authPass = Buffer.from((authString), 'base64').toString().split(':')[1];

    return {username: authUser, password: authPass}
}

router.post('/login', function(req, res) {

    // console.log(req);

    let authCredentials = authExtract(req.headers['authorization']);

    let authUser = authCredentials.username;
    let authPass = authCredentials.password;

    // find user check password
    let query = {};
    query['username'] = authUser;
    
    mongoose.model('users').findOne(query, function(err, user) {
        
        if(!user)
            return res.json("Invalid username or password");

        if (!(user.validPassword(authPass)))
            return res.json("Invalid username or password");

        if (err) {
            return res.json(err);
        }

        // if user checks out
        jwt.sign({user: user}, 'bananabread', function(err, token) {
            return res.json({
                token: token
            });
        });
    });
});

router.post('/signup', function(req, res) {

    let authCredentials = authExtract(req.headers['authorization']);

    let authUser = authCredentials.username;
    let authPass = authCredentials.password;

    // find user check password
    let query = {};
    query['username'] = authUser;

    mongoose.model('users').findOne(query, function(err, user) {

        if(user)
            return res.json('Username already taken');

        if (err) {
            return res.json(err);
        }

        var newUser = new User();
        newUser.username = authUser;
        newUser.password = newUser.generateHash(authPass);
    
        newUser.save(function(err) {
            if (err) {
                console.log(err);
            }
        });
    
        return res.json("Signup Successful!"); 
    });
});

module.exports = router;