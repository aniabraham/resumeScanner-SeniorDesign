export class ResumeData {
	name: string;
	education: [{university: string, degree: string, gpa: number, year: string}];
	experience: [{company: string, position: string, start: string, end: string }];
	keywords: string[];
	path: string;
	date: Date;
}