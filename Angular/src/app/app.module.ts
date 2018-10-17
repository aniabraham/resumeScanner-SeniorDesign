import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routes } from './app.router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AuthService } from './auth.service';

import { AppComponent } from './app.component';
import { TGamPdfViewerComponent } from './tgam-pdf-viewer/tgam-pdf-viewer.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { SearchTestComponent } from './search-test/search-test.component';
import { TGamPDFComponent } from './tgam-pdf/tgam-pdf.component';
import { TGamTableComponent } from './tgam-table/tgam-table.component';
import { FormViewerComponent } from './form-viewer/form-viewer.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ResumeViewerComponent } from './resume-viewer/resume-viewer.component';
import { SignupComponent } from './signup/signup.component';


@NgModule({
	declarations: [
		AppComponent,
		TGamPdfViewerComponent,
		SearchTestComponent,
		TGamPDFComponent,
		TGamTableComponent,
		FormViewerComponent,
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