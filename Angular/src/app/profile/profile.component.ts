import { Component, OnInit } from '@angular/core';
import { ResumeData } from '../resume-data';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


declare let $: any;

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	constructor(private router: Router, private sanitizer: DomSanitizer) { }

	private selectedResume: ResumeData;
	private displayName: string = '';
	private path: any;
	private selectedPath: string = '';

	private modalOptions = {
		show: true,
		keyboard: false,
		backdrop: 'static'
	};

	ngOnInit() {
	}

	onUpdate() {

	}

	onResumeSelected(event) {

		this.path = this.sanitizer.bypassSecurityTrustResourceUrl(event.path);
		this.selectedResume = event;
		this.selectedPath = this.selectedResume.path;
		this.displayName = event.name;
		$('#resumeModal').modal(this.modalOptions);
	}
}