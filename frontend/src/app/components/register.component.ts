import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { UserRole } from '../../shared/types';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex h-screen bg-white overflow-hidden">
      
      <!-- Left: Form -->
      <div class="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 relative z-10 overflow-y-auto py-10">
         <div class="mb-6">
            <a routerLink="/" class="text-2xl font-serif font-bold text-hive-dark">HELP <span class="text-hive-yellow-600">HIVE</span></a>
         </div>

         <h2 class="font-serif text-4xl text-hive-dark mb-2 leading-tight">Join the Hive.</h2>
         <p class="text-slate-500 mb-8 font-light">Create an account to connect with neighbors.</p>

          @if (error()) {
            <div class="p-4 rounded-2xl bg-rose-50 text-rose-500 text-sm font-medium mb-4">
              {{ error() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5 max-w-sm">
            
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input formControlName="name" type="text" class="block w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-hive-dark focus:ring-2 focus:ring-hive-yellow-500 focus:border-transparent transition-all">
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <input formControlName="email" type="email" class="block w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-hive-dark focus:ring-2 focus:ring-hive-yellow-500 focus:border-transparent transition-all">
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
              <input formControlName="fullAddress" type="text" class="block w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-hive-dark focus:ring-2 focus:ring-hive-yellow-500 focus:border-transparent transition-all" placeholder="e.g. 123 Maple St, Springfield">
            </div>

            <div class="space-y-1">
               <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">I want to be a</label>
               <select formControlName="role" class="block w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-hive-dark focus:ring-2 focus:ring-hive-yellow-500 focus:border-transparent transition-all cursor-pointer">
                 <option value="requester">Requester (Request Help)</option>
                 <option value="helper">Helper (Provide Help)</option>
               </select>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input formControlName="password" type="password" class="block w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-hive-dark focus:ring-2 focus:ring-hive-yellow-500 focus:border-transparent transition-all">
            </div>

            <button type="submit" [disabled]="form.invalid" class="w-full rounded-full bg-gradient-to-r from-hive-yellow-500 to-amber-600 py-4 text-white font-bold tracking-wide shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4">
               CREATE ACCOUNT
            </button>
          </form>

          <div class="mt-8 text-sm pb-10">
             <span class="text-slate-500">Already a member? </span>
             <a routerLink="/login" class="font-bold text-hive-dark border-b-2 border-hive-yellow-200 hover:border-hive-yellow-500 transition-colors">Sign In</a>
          </div>
      </div>

      <!-- Right: Art -->
      <div class="hidden lg:block lg:w-1/2 relative bg-hive-yellow-50">
         <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-[600px] h-[600px] bg-gradient-to-t from-amber-100 to-hive-yellow-50 rounded-full blur-3xl opacity-60 absolute top-0 right-0"></div>
            
            <img src="https://images.unsplash.com/photo-1558036117-15db5275d4bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" class="relative z-10 w-3/4 h-[80%] object-cover rounded-[3rem] shadow-2xl shadow-amber-900/10" alt="Workspace">
         </div>
      </div>

    </div>
  `
})
export class RegisterComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  private router: Router = inject(Router);

  error = signal<string>('');

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    fullAddress: ['', Validators.required],
    role: ['requester' as UserRole, Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.error.set('');
        const val = this.form.value;
        const isHelper = val.role === 'helper';
        const abstractAddress = val.fullAddress!.split(',').pop()?.trim() || 'Unknown Area';

        await this.dataService.register({
          name: val.name!,
          email: val.email!,
          contact_info: val.email!,
          location: abstractAddress,
          full_address: val.fullAddress!,
          abstract_address: abstractAddress,
          role: val.role!,
          password: val.password!
        } as any);
        this.router.navigate(['/dashboard']);
      } catch (err: any) {
        if (err.status === 409) {
          this.error.set('This email is already registered. Please login instead.');
        } else {
          this.error.set('Registration failed. Please try again.');
        }
      }
    }
  }
}