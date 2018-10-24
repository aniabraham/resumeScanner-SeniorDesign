import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { map } from 'rxjs/operators';

import { ResumeData } from './resume-data';
import { AuthService } from './auth.service';

let baseUrl:string = 'http://10.171.204.172:3000/resume/search';

@Injectable()
export class SearchService {

	constructor(private http: Http, private authService: AuthService) { }

	search(body: any): Promise<ResumeData[]> {

		let headers = new Headers();

		headers.append('authorization', 'Bearer ' 
			+ this.authService.getToken());

		return this.http.post(`${baseUrl}`, body, {headers: headers}).pipe(
			map(response => response.json().results as ResumeData[])).toPromise();
	}
}
