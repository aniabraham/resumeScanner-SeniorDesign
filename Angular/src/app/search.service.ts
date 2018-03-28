import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ResumeData } from './resume-data';

@Injectable()
export class SearchService {

	constructor(private http: Http) { }

	search(term: string, type: string): Observable<ResumeData[]> {

		return this.http.get(`api/data/?${type}=${term}`)
			.map(response => response.json().data as ResumeData[]);
	}
}
