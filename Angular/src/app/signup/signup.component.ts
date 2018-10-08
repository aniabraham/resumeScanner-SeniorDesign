import 'jquery';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

declare let $: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

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
