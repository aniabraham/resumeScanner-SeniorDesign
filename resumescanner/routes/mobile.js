let express = require('express');
let router = express.Router();
let verifyToken = require('../middleware/verify');
let jwt = require('jsonwebtoken');
let multer = require('multer');

const spawn = require("child_process").spawn;

let currentImage = '';

// These are necessary to include with the child process
// environment variables to allow tesseract to run properly
var parserEnv = {
    SHELL: '/bin/bash',
    CONDA_SHLVL: 1,
    LIBRARY_PATH: '/home/student/.sources/lib:/home/student/.sources/lib64:/'
                + 'home/student/.sources/lib:/home/student/.sources/lib64:',
    INSTALL_PREFIX: '/home/student/.sources',
    LD_LIBRARY_PATH: '/home/student/.sources/lib:/home/student/.sources/lib:',
    PATH: '/home/student/anaconda3/envs/resume_scanner/bin:' 
        + '/home/student/anaconda3/bin:' 
        + '/home/student/.sources/bin:/home/student/.sources/bin:/usr/local/'
        + 'sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/'
        + 'local/games:/snap/bin',   
    CONDA_PROMPT_MODIFIER: '(resume_scanner) ',
    CONDA_EXE: '/home/student/anaconda3/bin/conda',
    CONDA_PREFIX: '/home/student/anaconda3/envs/resume_scanner',
    CONDA_PYTHON_EXE: '/home/student/anaconda3/bin/python',
    CONDA_DEFAULT_ENV: 'resume_scanner',
    _: '/home/student/anaconda3/envs/resume_scanner/bin/python'
}
 
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
                    env: newEnv
                });
                    
            tesseract.on('exit', function (code, signal) {
                let currentOutput = currentImage.split('.')[0] + '.txt';
                let parsEnv = {};
                for (key in process.env) parsEnv[key] = process.env[key];
                for (key in parserEnv) parsEnv[key] = parserEnv[key];
                const parser = spawn('python',
                    [
                        '/home/student/resume_parser/bin/main.py',
                        '/home/student/finished/' + currentOutput
                    ],
                    {
                    cwd: '/home/student/resume_parser/bin',
                    shell: '/bin/bash',
                    env: parsEnv
                    });
                
                parser.stdout.on('data', function(data) {
                    let response = data.toString('utf8');
                    response = response.replace('/\"/g','"');
                    return res.json(JSON.parse(response));
                });
		
                parser.stderr.on('data', function(data) {
                    let response = data.toString('utf8');
                    response = response.split('\"').join('"');
                    console.log(response);
                });
                parser.on('exit', function(code, signal) {
                        console.log(code);
                        console.log(signal);
                    });
                parser.on('error', function(error) {
                    console.log(error);
                });
            });
        }
    });
});

module.exports = router;
