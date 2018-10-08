var express = require('express');
var router = express.Router();
var verifyToken = require('../middleware/verify');
var jwt = require('jsonwebtoken');

router.post('/new', verifyToken, function(req, res, next) {

    jwt.verify(req.token, 'bananabread', (err, authData) => {
        if(err)
            res.sendStatus(403);

        else {
            res.send('the post request was received.');
        }
    });
});

module.exports = router;