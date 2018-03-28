import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-tgam-pdf',
	templateUrl: './tgam-pdf.component.html',
	styleUrls: ['./tgam-pdf.component.css']
})
export class TGamPDFComponent implements OnInit {

	@Input() path;

	constructor() { }

	ngOnInit() {
	}

}
