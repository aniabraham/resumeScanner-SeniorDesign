var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

const ResumeData = new Schema({
    name: String,
    email: String,
    education: [Education],
    experience: [Experience],
	keywords: [String],
    path: String,
    date: Date
});

module.exports = mongoose.model('resumes', ResumeData);