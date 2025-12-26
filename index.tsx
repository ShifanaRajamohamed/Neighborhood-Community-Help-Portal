

import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, Routes } from '@angular/router';
import { AppComponent } from './src/frontend/app.component';
import { LoginComponent } from './src/frontend/components/login.component';
import { RegisterComponent } from './src/frontend/components/register.component';
import { DashboardComponent } from './src/frontend/components/dashboard.component';
import { CreateRequestComponent } from './src/frontend/components/create-request.component';
import { LandingComponent } from './src/frontend/components/landing.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create-request', component: CreateRequestComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation())
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
