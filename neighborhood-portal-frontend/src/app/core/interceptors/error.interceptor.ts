import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only logout on 401 errors that indicate invalid/expired token
      // Don't logout on 403 (forbidden/insufficient permissions)
      if (error.status === 401) {
        const errorMessage = error.error?.error || '';
        // Check if it's a token-related error
        const tokenErrors = ['token', 'expired', 'invalid', 'Authentication required', 'jwt'];
        const isTokenError = tokenErrors.some(keyword =>
          errorMessage.toLowerCase().includes(keyword.toLowerCase())
        );

        if (isTokenError) {
          console.log('Token error detected, logging out');
          authService.logout();
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
