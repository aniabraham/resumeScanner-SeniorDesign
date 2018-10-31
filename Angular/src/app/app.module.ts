import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routes } from './app.router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AuthService } from './auth.service';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { SearchTestComponent } from './search-test/search-test.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ResumeViewerComponent } from './resume-viewer/resume-viewer.component';
import { SignupComponent } from './signup/signup.component';


@NgModule({
	declarations: [
		AppComponent,
		SearchTestComponent,
		LoginComponent,
		ProfileComponent,
		ResumeViewerComponent,
		SignupComponent 
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		routes,
		BrowserAnimationsModule
	],
	providers: [ AuthService ],
	bootstrap: [AppComponent]
})
export class AppModule { }