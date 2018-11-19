var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Education = new Schema({
    university: String, 
    degree: String, 
    gpa: Number,
    // year of graduation
    year: Number
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
    phone: Number,
    education: [Education],
    experience: [Experience],
	keywords: [String],
    path: String,
    date: Date
});

module.exports = mongoose.model('resumes', ResumeData);