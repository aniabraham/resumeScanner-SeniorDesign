import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class AuthService {

	private baseUrl = 'http://127.0.0.1:3000/authentication/login'

	private isAuthenticated: boolean = false;

	constructor(private http: Http) {}

	authenticateUser(usercreds) {
		var headers = new Headers();

		headers.append('Access-Control-Allow-Origin', '*');
		headers.append('Authorization', 'Basic ' + usercreds);
		headers.append("Content-Type",  "application/x-www-form-urlencoded");

		// need to change to direct to project server, as well as encrypt information
		return new Promise((resolve) => {
			this.http.post(this.baseUrl, {}, {headers: headers}).subscribe((data) => {
				console.log(data.json().token);
				window.localStorage.setItem('auth_key', data.json().token);
				this.isAuthenticated = true;
			
				resolve(this.isAuthenticated);
				}
			)
		});
	}

	public getToken(): string {
		if (this.isAuthenticated)
			return window.localStorage.getItem('auth_key');
		else
			return undefined;
	}

	public getAuth(): boolean {
		return this.isAuthenticated;
	}
}
