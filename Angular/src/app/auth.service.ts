import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';


// https://github.com/rajayogan/angular2-new-authentication/blob/master/src/app/auth/auth.service.ts
@Injectable()
export class AuthService {

	isAuthenticated: boolean = false;

	constructor(private http: Http) {}

	authenticateNow(usercreds) {
		var headers = new Headers();
		var creds = 'name=' + usercreds.username + '&password=' + usercreds.password;

		headers.append('Content-Type', 'application/X-www-form-urlencoded');

		// need to change to direct to project server, as well as encrypt information
		return new Promise((resolve) => {
			this.http.post('http://localhost:3333/authenticate', creds, {headers: headers}).subscribe((data) => {
				if(data.json().success) {
					window.localStorage.setItem('auth_key', data.json().token);
					this.isAuthenticated = true;
				}
					resolve(this.isAuthenticated);
				}
			)
		});
	}

}
