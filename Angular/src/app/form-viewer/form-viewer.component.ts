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

	//
	// A LOT OF THIS STUFF IS HELPFUL IF WE DECIDE TO 
	// DO ANY KIND OF LOGIN SETUP, SO I'M LEAVING IT
	// BUT IT CURRENTLY DOESN'T DO ANYTHING, MIGHT MOVE IT 
	// TO A SEPARATE FILE JUST FOR STORAGE LATER
	//
	
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
