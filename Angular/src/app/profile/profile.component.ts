import { Component, OnInit } from '@angular/core';
import { ResumeData } from '../resume-data';
import { Router } from '@angular/router';
import { RequestOptions, Headers, Http } from '@angular/http';
import { AuthService } from '../auth.service'
import { DomSanitizer } from '@angular/platform-browser';


declare let $: any;

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	constructor(private router: Router, private sanitizer: DomSanitizer, private authService: AuthService) { }

	private selectedResume: ResumeData;
	private displayName: string = '';
	private path: any;

	private modalOptions = {
		show: true,
		keyboard: false,
		backdrop: 'static'
	};

	ngOnInit() {
	}

	onResumeSelected(event) {

		this.path = this.sanitizer.bypassSecurityTrustResourceUrl(event.path);
		this.selectedResume = event;
		this.displayName = event.name;
		$('#resumeModal').modal(this.modalOptions);
	}
}