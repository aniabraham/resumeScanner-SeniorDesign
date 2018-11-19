export class ResumeData {
	_id: any;
	name: string;
	phone: number;
	email: string;
	education: [{university: string, degree: string, gpa: number, year: string}];
	experience: [{company: string, position: string, totalExperience: number }];
	keywords: string[];
	path: string;
	date: Date;
}