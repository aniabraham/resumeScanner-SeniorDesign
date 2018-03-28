import { Component, OnInit } from '@angular/core';
import { FormViewerComponent } from '../form-viewer/form-viewer.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	private loginFailed: boolean;

	constructor(private router: Router) { }

	ngOnInit() {
	}

	onLogin(event) {
		// attempt to login
		// if bad login returned, loginFailed = true
		// otherwise = false

		// on success
		this.router.navigate(['/resumes']);
	}

	onSignup() {

	}
}