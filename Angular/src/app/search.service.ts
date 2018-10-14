import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

import { ResumeData } from './resume-data';
import { AuthService } from './auth.service';

let baseUrl:string = 'http://127.0.0.1:3000/resume/search';

@Injectable()
export class SearchService {

	constructor(private http: Http, private authService: AuthService) { }

	search(body: any): Promise<ResumeData[]> {

		let headers = new Headers();

		headers.append('authorization', 'Bearer ' 
			+ this.authService.getToken());

		return this.http.post(`${baseUrl}`, body, {headers: headers})
			.map(response => response.json().results as ResumeData[]).toPromise();
	}
}
