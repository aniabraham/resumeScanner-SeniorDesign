import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
	createDb(){
		const data = [
						
			{name: "John Hamm", education: [{university: "University of Central Florida", degree: "Bachelor's of Science in Computer Science", gpa: 2.1, year: "2016"}], 
				experience: [{company: "Fake Inc.", position: "Manager of Something", start: "03/25/2015", end: "03/26/2015" }], comments: "Fired Immediately",
				path: "http://www.goodresumesamples.com/wp-content/uploads/2016/06/example-of-good-resume-768x994.png"},

			{name: "John Slam", education: [{university: "University of Central Florida", degree: "Bachelor's of Science in Computer Science", gpa: 2.1, year: "2016"}], 
				experience: [{company: "Fake Inc.", position: "Manager of Something", start: "03/25/2015", end: "03/26/2015" }], comments: "Fired Immediately",
				path: "http://www.goodresumesamples.com/wp-content/uploads/2016/06/example-of-good-resume-768x994.png"},

			{name: "John Ron", education: [{university: "University of Central Florida", degree: "Bachelor's of Science in Computer Science", gpa: 2.1, year: "2016"}], 
				experience: [{company: "Fake Inc.", position: "Manager of Something", start: "03/25/2015", end: "03/26/2015" }], comments: "Fired Immediately",
				path: "http://www.goodresumesamples.com/wp-content/uploads/2016/06/example-of-good-resume-768x994.png"},

			{name: "Edward Hamm", education: [{university: "University of Central Florida", degree: "Bachelor's of Science in Computer Science", gpa: 2.1, year: "2016"}], 
				experience: [{company: "Fake Inc.", position: "Manager of Something", start: "03/25/2015", end: "03/26/2015" }], comments: "Fired Immediately",
				path: "http://www.goodresumesamples.com/wp-content/uploads/2016/06/example-of-good-resume-768x994.png"},

			{name: "Susan Hamm", education: [{university: "University of Central Florida", degree: "Bachelor's of Science in Computer Science", gpa: 2.1, year: "2016"}], 
				experience: [{company: "Fake Inc.", position: "Manager of Something", start: "03/25/2015", end: "03/26/2015" }], comments: "Fired Immediately",
				path: "http://www.goodresumesamples.com/wp-content/uploads/2016/06/example-of-good-resume-768x994.png"}
					

		];
		return {data};
	}
}