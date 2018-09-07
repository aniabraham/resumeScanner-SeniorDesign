const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var db = mongoose.createConnection('mongodb://127.0.0.1:27017/Resumes');

const Education = new Schema({
    university: String, degree: String, gpa: Number
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


const startData = [
    {
        name: "John Hamm", 
        education: 
            [{
                university: "University of Central Florida", 
                degree: "Bachelor's of Science in Computer Science", gpa: 2.1
            }], 
        experience: 
            [{
                company: "Fake Inc.", position: "Manager of Something", 
                totalExperience: 7
            }],
        keywords: ["good at embezzlement", "shaggy hair"],
        path: "http://www.goodresumesamples.com/wp-content/uploads/2016/06/example-of-good-resume-768x994.png",
        date: new Date(2018, 9, 5)
    },

    {
        name: "John Smarty", 
        education: 
            [{
                university: "University of Central Florida", 
                degree: "Bachelor's of Science in Computer Science", gpa: 4.0
            },
            {
                university: "Stanford",
                degree: "Master's of Science in Economics", gpa: 4.0
            }], 
        experience: 
            [{
                company: "Prestigious Inc.", position: "Manager of Everything", 
                totalExperience: 4
            }],
        keywords: ["super smart", "Javascript", "Python", "Unix"],
        path: "http://www.goodresumesamples.com/wp-content/uploads/2016/06/example-of-good-resume-768x994.png",
        date: new Date(2018, 9, 4)
    },

    {
        name: "John Super Smarty",
        education: 
            [{
                university: "University of Central Florida", 
                degree: "Bachelor's of Science in Computer Science", gpa: 4.0
            },
            {
                university: "Stanford",
                degree: "Master's of Science in Economics", gpa: 4.0
            }], 
        experience: 
            [{
                company: "Prestigious Inc.", position: "Manager of Everything", 
                totalExperience: 4
            },
            {
                company: "Super Prestigious Inc.",
                position: "Manager of More Things", 
                totalExperience: 12
            }],
        keywords: ["Kobol", "C#", "Management", "Leader"],
        path: "http://www.goodresumesamples.com/wp-content/uploads/2016/06/example-of-good-resume-768x994.png",
        date: new Date(2018, 9, 3)
    }
]

startData.forEach( function(data) {
    var newResume = new ResumeModel(data);
    newResume.save(function(err) {
        if (err) {
            console.log(err);
        }
    });
})