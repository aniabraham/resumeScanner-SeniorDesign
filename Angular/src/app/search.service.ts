import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { map } from 'rxjs/operators';

import { ResumeData } from './resume-data';
import { AuthService } from './auth.service';

// let baseUrl:string = 'http://127.0.0.1:3000/resume/';
let baseUrl:string = 'http://10.171.204.172:3000/resume/';

@Injectable()
export class SearchService {

	constructor(private http: Http, private authService: AuthService) { }

	public search(body: any): Promise<ResumeData[]> {

		let headers = new Headers();

		headers.append('authorization', 'Bearer ' 
			+ this.authService.getToken());

		return this.http.post(`${baseUrl}search`, body, {headers: headers}).pipe(
			map(response => response.json().results as ResumeData[])).toPromise();
	}

	public getImage(path: string): Promise<any> {

		if (path === null || path === undefined || path === '')
			return new Promise(null);

		let headers = new Headers();

		headers.append('authorization', 'Bearer ' 
			+ this.authService.getToken());

		return this.http.get(`${baseUrl}image/${path}`, {headers: headers})
			.pipe(map(response => response.text())).toPromise();
	}

	public update(body: any): void {
		let headers = new Headers();

		headers.append('authorization', 'Bearer ' 
			+ this.authService.getToken());

		// This should return a success boolean to inform the user
		this.http.put(`${baseUrl}update`, body, {headers: headers})
			.pipe().toPromise().then(response => {
				console.log(response);
			});
	}
}
