import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class AuthService {

	private baseUrl = 'http://10.171.204.172:3000/authentication/'

	private isAuthenticated: boolean = false;

	constructor(private http: Http) {}

	public authenticateUser(usercreds) {
		let headers = new Headers();

		headers.append('Authorization', 'Basic ' + usercreds);
		headers.append("Content-Type",  "application/x-www-form-urlencoded");

		// need to change to direct to project server, as well as encrypt information
		return new Promise((resolve) => {
			this.http.post(this.baseUrl + 'login', {}, {headers: headers}).subscribe((data) => {
				
				if (data.json().token) {
					window.localStorage.setItem('auth_key', data.json().token);
					this.isAuthenticated = true;
				}
				
				resolve(this.isAuthenticated);
			});
		});
	}

	public createUser(usercreds): void {
		let headers = new Headers();

		headers.append('Authorization', 'Basic ' + usercreds);
		headers.append("Content-Type",  "application/x-www-form-urlencoded");

		this.http.post(this.baseUrl + 'signup', {}, {headers: headers})
			.subscribe(data => {
				console.log(data);
			});
	}

	public getToken(): string {
		if (this.isAuthenticated)
			return window.localStorage.getItem('auth_key');
		else
			return undefined;
	}

	public logout(): void {
		this.isAuthenticated = false;
		window.localStorage.setItem('auth_key', undefined);
	}

	public getAuth(): boolean {
		return this.isAuthenticated;
	}
}
