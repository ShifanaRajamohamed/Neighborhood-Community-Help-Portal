import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { ResidentGuard } from './core/requester.guard';
import { HelperGuard } from './core/helper.guard';
import { LoginComponent } from './modules/main/login.component';
import { RegisterComponent } from './modules/main/register.component';
import { DashboardComponent } from './modules/main/dashboard.component';
import { CreateRequestComponent } from './modules/main/create-request.component';
import { LandingComponent } from './modules/main/landing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'create-request', component: CreateRequestComponent, canActivate: [AuthGuard, ResidentGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
