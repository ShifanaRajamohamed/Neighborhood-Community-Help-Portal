import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './shared/models/types';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/registration/registration.component').then(m => m.RegistrationComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'requests',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./requests/request-list/request-list.component').then(m => m.RequestListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./requests/help-request/help-request.component').then(m => m.HelpRequestComponent),
        canActivate: [roleGuard(UserRole.RESIDENT)]
      },
      {
        path: ':id',
        loadComponent: () => import('./requests/request-detail/request-detail.component').then(m => m.RequestDetailComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(UserRole.ADMIN)],
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'requests',
        loadComponent: () => import('./admin/admin-requests/admin-requests.component').then(m => m.AdminRequestsComponent)
      },
      {
        path: 'requests/:id',
        loadComponent: () => import('./admin/admin-request-detail/admin-request-detail.component').then(m => m.AdminRequestDetailComponent)
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
