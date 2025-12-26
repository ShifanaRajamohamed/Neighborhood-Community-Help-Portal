
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../frontend/services/data.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 h-screen">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          @if (error()) {
            <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
              <span class="font-medium">Error!</span> {{ error() }}
            </div>
          }

          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div class="mt-2">
              <input formControlName="email" id="email" type="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3">
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            </div>
            <div class="mt-2">
              <input formControlName="password" id="password" type="password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3">
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="loginForm.invalid" class="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:bg-gray-400">Sign in</button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <a routerLink="/register" class="font-semibold leading-6 text-emerald-600 hover:text-emerald-500">Register now</a>
        </p>

        <div class="mt-8 border-t pt-6 text-center text-xs text-gray-500">
          <p class="font-bold mb-2">Demo Credentials:</p>
          <p>Resident: alice@test.com / password</p>
          <p>Helper: bob@test.com / password</p>
          <p>Admin: admin@test.com / password</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  private router: Router = inject(Router);

  error = signal<string>('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const success = this.dataService.login(email!, password!);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Invalid email or password');
      }
    }
  }
}
