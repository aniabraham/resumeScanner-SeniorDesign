import { Component, OnInit } from '@angular/core';

// Necessary for angular to allow your URL to be displayed in an iframe
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-tgam-pdf-viewer',
	templateUrl: './tgam-pdf-viewer.component.html',
	styleUrls: ['./tgam-pdf-viewer.component.css']
})
export class TGamPdfViewerComponent implements OnInit {

	private path;

	constructor(private sanitizer: DomSanitizer) {}

	ngOnInit() {
	}
	onNotifyClicked(event) {
		
		this.path = this.sanitizer.bypassSecurityTrustResourceUrl(event); // Potentially a vulnerability  
	}
}