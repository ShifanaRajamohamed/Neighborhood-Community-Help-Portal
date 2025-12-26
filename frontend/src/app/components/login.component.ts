import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="flex h-screen bg-white overflow-hidden">
      
      <!-- Left: Form -->
      <div class="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 relative z-10">
         <div class="mb-10">
            <a routerLink="/" class="text-2xl font-serif font-bold text-hive-dark">HELP <span class="text-hive-yellow-600">HIVE</span></a>
         </div>

         <h2 class="font-serif text-5xl text-hive-dark mb-4 leading-tight">Welcome <br> Back.</h2>
         <p class="text-slate-500 mb-10 font-light">Enter your credentials to access the hive.</p>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6 max-w-sm">
            
            @if (error()) {
              <div class="p-4 rounded-2xl bg-rose-50 text-rose-500 text-sm font-medium animate-pulse">
                {{ error() }}
              </div>
            }

            <div class="space-y-1">
              <label for="email" class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <input formControlName="email" id="email" type="email" class="block w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-hive-dark focus:ring-2 focus:ring-hive-yellow-500 focus:border-transparent transition-all">
            </div>

            <div class="space-y-1">
              <label for="password" class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input formControlName="password" id="password" type="password" class="block w-full rounded-2xl border-slate-200 bg-slate-50 py-3 px-4 text-hive-dark focus:ring-2 focus:ring-hive-yellow-500 focus:border-transparent transition-all">
            </div>

            <button type="submit" [disabled]="loginForm.invalid" class="w-full rounded-full bg-hive-dark py-4 text-white font-bold tracking-wide shadow-xl hover:bg-gray-700 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
               SIGN IN
            </button>
          </form>

          <div class="mt-8 text-sm">
             <span class="text-slate-500">No account? </span>
             <a routerLink="/register" class="font-bold text-hive-dark border-b-2 border-hive-yellow-200 hover:border-hive-yellow-500 transition-colors">Create one</a>
          </div>
          
          <!-- Demo Access Section -->
          <div class="mt-10 p-5 bg-slate-50/80 rounded-[2rem] border border-slate-100">
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Quick Demo Login</p>
             
             <div class="grid grid-cols-1 gap-2">
               <button type="button" (click)="autoFill('alice@test.com')" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all text-left border border-transparent hover:border-slate-100 group">
                  <div class="w-8 h-8 rounded-full bg-hive-yellow-100 flex items-center justify-center text-hive-yellow-600 font-bold text-xs group-hover:scale-110 transition-transform">R</div>
                  <div>
                     <p class="text-xs font-bold text-slate-700">Requester</p>
                     <p class="text-[10px] text-slate-400">alice@test.com</p>
                  </div>
               </button>

               <button type="button" (click)="autoFill('bob@test.com')" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all text-left border border-transparent hover:border-slate-100 group">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs group-hover:scale-110 transition-transform">H</div>
                  <div>
                     <p class="text-xs font-bold text-slate-700">Helper</p>
                     <p class="text-[10px] text-slate-400">bob@test.com</p>
                  </div>
               </button>

               <button type="button" (click)="autoFill('admin@test.com')" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all text-left border border-transparent hover:border-slate-100 group">
                  <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs group-hover:scale-110 transition-transform">A</div>
                  <div>
                     <p class="text-xs font-bold text-slate-700">Admin</p>
                     <p class="text-[10px] text-slate-400">admin@test.com</p>
                  </div>
               </button>
             </div>
          </div>
      </div>

      <!-- Right: Art -->
      <div class="hidden lg:block lg:w-1/2 relative bg-hive-yellow-50">
         <div class="absolute inset-0 flex items-center justify-center">
            <!-- Abstract Shapes -->
            <div class="w-[500px] h-[500px] bg-gradient-to-tr from-hive-yellow-100 to-amber-100 rounded-full blur-3xl opacity-60 absolute top-1/4 right-1/4 animate-pulse"></div>
            <div class="w-[400px] h-[400px] bg-gradient-to-bl from-gray-100 to-slate-50 rounded-full blur-3xl opacity-60 absolute bottom-1/4 left-1/4"></div>
            
            <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" class="relative z-10 w-3/4 h-[80%] object-cover rounded-[3rem] shadow-2xl shadow-amber-900/10 hover:scale-[1.01] transition-transform duration-700" alt="Community">
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

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value as { email: string; password: string };
      const success = await this.dataService.login(email, password);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Invalid email or password');
      }
    }
  }

  autoFill(email: string) {
    this.loginForm.patchValue({
      email: email,
      password: 'password'
    });
    this.error.set(''); // Clear any previous errors
  }
}
