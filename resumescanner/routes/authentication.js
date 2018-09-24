var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

router.post('/new', function(req, res) {
  res.send('the post request was received.');
});

// pretty much all of this from
// https://www.youtube.com/watch?v=7nafaH9SddU

router.post('/login', function(req, res) {
    // find user check password

    // if user checks out
    jwt.sign({user: user}, 'bananabread', function(err, token) {
        res.json({
            token: token
        });
    });

    // else return not found
});

function authenticateUser(req, res, next) {
    const bearerHeader =
}

module.exports = router;