import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

export const router: Routes = [
	{path: '', redirectTo: 'resumes', pathMatch: 'full' },
	// {path: 'login', component: LoginComponent},
	{path: 'resumes', component: ProfileComponent}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);