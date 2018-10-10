import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ResumeData } from './resume-data';

let baseUrl:string = 'http://127.0.0.1/resume/search';

@Injectable()
export class SearchService {

	constructor(private http: Http) { }

	search(body: any): Observable<ResumeData[]> {

		return this.http.post(`${baseUrl}`, body)
			.map(response => response.json() as ResumeData[]);
	}
}
