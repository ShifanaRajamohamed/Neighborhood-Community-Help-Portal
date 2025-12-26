import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LandingComponent } from './app/components/landing.component';
import { LoginComponent } from './app/components/login.component';
import { RegisterComponent } from './app/components/register.component';
import { DashboardComponent } from './app/components/dashboard.component';
import { CreateRequestComponent } from './app/components/create-request.component';

const routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create-request', component: CreateRequestComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));
