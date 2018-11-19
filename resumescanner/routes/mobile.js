let express = require('express');
let router = express.Router();
let verifyToken = require('../middleware/verify');
let jwt = require('jsonwebtoken');
let multer = require('multer');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var db = mongoose.createConnection('mongodb://127.0.0.1:27017/resumes');

const spawn = require("child_process").spawn;

let currentImage = '';

let newResume = null;

var multerErr = false;

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

const Education = new Schema({
    university: String, degree: String, gpa: Number, year: Number
});

const Experience = new Schema({
    company: String, position: String, totalExperience: Number
});

const ResumeData = new Schema({
    name: String,
    education: [Education],
    experience: [Experience],
	keywords: [String],
    path: String,
    date: Date
});

const ResumeModel = db.model('Resume', ResumeData);

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

                        tesseract.stderr.on('data', function(data) {
                            let response = data.toString('utf8');
                            response = response.split('\"').join('"');
                            console.log(response);
                        });

                        tesseract.on('error', function(error) {
                            console.log(error);
                        });
                            
                        tesseract.on('exit', function (code, signal) {

                            // if tesseract scanned successfully.
                            if (code == 0) {
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
                                    response = JSON.parse(response);
                                    response['date'] = Date.now();
                                    response['path'] = currentImage;
                                    newResume = new ResumeModel(response[0]);
                                    newResume.save(function (err) {
                                            console.log(err);
                                        });
                                    return res.json(response);
                                });
                        
                                parser.stderr.on('data', function(data) {
                                    let response = data.toString('utf8');
                                    response = response.split('\"').join('"');
                                    console.log(response);
                                });
                                parser.on('exit', function(code, signal) {
                                    
                                });
                                parser.on('error', function(error) {
                                    console.log(error);
                                });
                            }

                            else {
                                return res.json(
                                    "Tesseract failed to scan with error code: " + code
                                );
                            }
                        });
                    }
            });
        }
    });
});

module.exports = router;
