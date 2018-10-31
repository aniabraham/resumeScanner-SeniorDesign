let express = require('express');
let router = express.Router();
let verifyToken = require('../middleware/verify');
let jwt = require('jsonwebtoken');
let multer = require('multer');

const spawn = require("child_process").spawn;

let currentImage = '';

// These are necessary to include with the child process
// environment variables to allow tesseract to run properly
var tesseractEnv = { 
    SHELL: '/bin/bash',
    LIBRARY_PATH: '/home/student/.sources/lib:/home/student/.sources/lib64:/'
                + 'home/student/.sources/lib:/home/student/.sources/lib64:',
    TESSDATA_PREFIX: '/home/student/tesseract-3.05.02/tessdata',
    INSTALL_PREFIX: '/home/student/.sources',
    LD_LIBRARY_PATH: '/home/student/.sources/lib:/home/student/.sources/lib:',
    PATH: '/home/student/.sources/bin:/home/student/.sources/bin:/usr/local/'
        + 'sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/'
        + 'local/games:/snap/bin',
}

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
                    
                }
            });

            let newEnv = {};
            // copy current process environment variables in
            for (key in process.env) newEnv[key] = process.env[key];

            // overwrite necessary variables for tesseract execution
            for (key in tesseractEnv) newEnv[key] = tesseractEnv[key];
            const tesseract = spawn('python', 
                [
                    '/home/student/testing/shelltest.py',
                    __dirname + '/../images',
                    currentImage
                ],
                {
                    shell: '/bin/bash',
                    env: newEnv,
                });
                    
            tesseract.on('exit', function (code, signal) {
                return res.json('success!');
            });
        }
    });
});

module.exports = router;
