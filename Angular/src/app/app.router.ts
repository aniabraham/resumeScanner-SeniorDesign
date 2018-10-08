import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

export const router: Routes = [
	{path: '', redirectTo: 'login', pathMatch: 'full' },
	// {path: 'login', component: LoginComponent},
	{path: 'resumes', component: ProfileComponent,
	canActivate: [AuthGuard]},
	{path: 'login', component: LoginComponent}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);