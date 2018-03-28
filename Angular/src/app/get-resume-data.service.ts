import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { ResumeData } from './resume-data';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GetResumeDataService {

	private headers = new Headers({'Content-Type': 'application/json'});

	private targetUrl = 'api/data';
	
	constructor(private http: Http) { }

	getData(): Promise<ResumeData[]> {

		return this.http.get(this.targetUrl)
			.toPromise()
			.then(response => response.json().data as ResumeData[])
			.catch(this.handleError);

		
	}

	private handleError(error: any): Promise<any> {
		console.error("There was an error", error);
		return Promise.reject(error.message || error);
	}
}