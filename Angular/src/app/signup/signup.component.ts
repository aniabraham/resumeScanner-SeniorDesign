import 'jquery';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AuthService } from '../auth.service';

declare let $: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    @Output() exit: EventEmitter<void> = new EventEmitter<void>();

    // Displaying the indicator that the passwords do or do not match
    private passMatch: boolean = false;
    private passMiss: boolean = false;

    constructor(private authService: AuthService) { }

    ngOnInit() {
    }

    onCancel() {
      
      $(':input').val('');
      this.exit.emit();
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

      let signupCreds = btoa($('#username').val() + ':' 
        + $('#password').val());

      this.authService.createUser(signupCreds);

      this.exit.emit();
    }
}
