
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../frontend/services/data.service';
import { UserRole } from '../shared/types';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 min-h-screen">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create an account</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <div>
            <label class="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
            <div class="mt-2">
              <input formControlName="name" type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div class="mt-2">
              <input formControlName="email" type="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium leading-6 text-gray-900">Location (City/Address)</label>
            <div class="mt-2">
              {/* FIX: Changed formControlName from 'location' to 'fullAddress' to match the User type. */}
              <input formControlName="fullAddress" type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3">
            </div>
          </div>

          <div>
             <label class="block text-sm font-medium leading-6 text-gray-900">I want to be a:</label>
             <div class="mt-2">
               <select formControlName="role" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3">
                 {/* FIX: Changed role value from 'resident' to 'requester' to match UserRole type. */}
                 <option value="requester">Resident (Request Help)</option>
                 <option value="helper">Helper (Provide Help)</option>
               </select>
             </div>
          </div>

          <div>
            <label class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="mt-2">
              <input formControlName="password" type="password" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 px-3">
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="form.invalid" class="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:bg-gray-400">Register</button>
          </div>
        </form>
        <p class="mt-10 text-center text-sm text-gray-500">
          Already have an account?
          <a routerLink="/login" class="font-semibold leading-6 text-emerald-600 hover:text-emerald-500">Sign in</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  private router: Router = inject(Router);

  // FIX: Changed form control 'location' to 'fullAddress' and role default value to 'requester'.
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    fullAddress: ['', Validators.required],
    role: ['requester' as UserRole, Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // FIX: Updated registration logic to match User type properties.
  onSubmit() {
    if (this.form.valid) {
      const val = this.form.value;
      const isHelper = val.role === 'helper';
      const abstractAddress = val.fullAddress!.split(',').pop()?.trim() || 'Unknown Area';

      this.dataService.register({
        name: val.name!,
        email: val.email!,
        fullAddress: val.fullAddress!,
        abstractAddress: abstractAddress,
        role: val.role!,
        password: val.password!,
        isApproved: !isHelper // Requesters are approved by default, helpers are not.
      });
      this.router.navigate(['/dashboard']);
    }
  }
}
