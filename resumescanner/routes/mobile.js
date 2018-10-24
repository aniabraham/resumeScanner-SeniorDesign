let express = require('express');
let router = express.Router();
let verifyToken = require('../middleware/verify');
let jwt = require('jsonwebtoken');
let multer = require('multer');

const spawn = require("child_process").spawnSync;

let currentImage = '';

router.post('/new', verifyToken, function(req, res, next) {

    jwt.verify(req.token, 'bananabread', (err, authData) => {
        if(err)
            res.sendStatus(403);

        else {
            currentImage = (String(Date.now()) 
                      +  String(Math.floor(Math.random() * 10))
                      +  String(Math.floor(Math.random() * 10))
                      +  '.png');

            let multerStorage = multer.diskStorage({
                destination: function(req, file, callback) {
                    callback(null, __dirname + '/../images/');
                },

                filename: function(req, file, callback) {
                    callback(null, currentImage);
                }
            });

            let multerUpload = 
                multer({storage: multerStorage}).single('resume');

            multerUpload(req, res, err => {

                if (err) {
                    return res.json(err);
                }
                else {
                    let tesseract = spawn('python', 
                        [
                            '../../../../../student/testing/shell.py',
                            __dirname + '/' + currentImage
                        ]);

                    return res.json('success!');
                }
            });
        }
    });
});

module.exports = router;