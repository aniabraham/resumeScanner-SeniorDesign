import 'jquery';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

declare let $: any;

@Component({
	selector: 'app-form-viewer',
	templateUrl: './form-viewer.component.html',
	styleUrls: ['./form-viewer.component.css'],
	providers: []
})
export class FormViewerComponent implements OnInit {
	
	@Output() data: EventEmitter<JSON> = new EventEmitter<JSON>();

	// Displaying the indicator that the passwords do or do not match
	private passMatch: boolean = false;
	private passMiss: boolean = false;

	constructor() { }

	ngOnInit() {
	}

	onCancel() {
		
		$(':input').val('');
	}

	checkPass(pass1, pass2) {
		if (pass1 === pass2) {
			this.passMatch = true;
			this.passMiss = false;
		}
		else {
			this.passMiss = true;
			this.passMatch = false;
		}
	}

	onConfirm() {

		this.onCancel();
	}
}
