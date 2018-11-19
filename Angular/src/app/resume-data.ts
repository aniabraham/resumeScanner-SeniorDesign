export class ResumeData {
	_id: any;
	name: string;
	phone: number;
	email: string;
	education: [{_id: any, university: string, degree: string, gpa: number, year: string}];
	experience: [{_id: any, company: string, position: string, totalExperience: number }];
	keywords: string[];
	path: string;
	date: Date;
}
