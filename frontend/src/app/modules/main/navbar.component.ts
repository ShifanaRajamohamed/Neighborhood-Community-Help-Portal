import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="absolute top-0 left-0 w-full z-50 bg-transparent pt-6 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        
        <!-- Logo -->
        <a routerLink="/" class="group flex items-center gap-3">
          <div class="relative">
             <div class="absolute -inset-1 bg-gradient-to-r from-hive-yellow-300 to-hive-yellow-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
             <div class="relative bg-white rounded-full p-2.5 shadow-sm">
                <!-- Hive Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-hive-yellow-600">
                  <path d="M13.442 2.654a2.25 2.25 0 00-2.884 0l-4.5 3.75a2.25 2.25 0 00-1.058 1.946V15.75a2.25 2.25 0 001.058 1.946l4.5 3.75a2.25 2.25 0 002.884 0l4.5-3.75a2.25 2.25 0 001.058-1.946V8.35a2.25 2.25 0 00-1.058-1.946l-4.5-3.75z" />
                </svg>
             </div>
          </div>
          <span class="font-serif font-bold text-2xl tracking-wide text-hive-dark">HELP <span class="text-hive-yellow-600">HIVE</span></span>
        </a>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
           @if (dataService.currentUser()) {
              <a routerLink="/dashboard" class="text-sm font-medium text-slate-600 hover:text-hive-yellow-600 transition-colors">Dashboard</a>
              @if (dataService.currentUser()?.role === 'requester') {
                 <a routerLink="/create-request" class="text-sm font-medium text-slate-600 hover:text-hive-yellow-600 transition-colors">Create Request</a>
              }
              <div class="flex items-center gap-4 pl-4 border-l border-slate-200">
                  <span class="font-serif text-hive-dark italic">Hi, {{ dataService.currentUser()?.name }}</span>
                  <button (click)="logout()" class="rounded-full bg-hive-dark px-5 py-2 text-xs font-bold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-700 hover:scale-105 transition-all">
                    Logout
                  </button>
              </div>
           } @else {
              <a routerLink="/" class="text-sm font-medium text-slate-600 hover:text-hive-yellow-600 transition-colors">Home</a>
              <a routerLink="/login" class="text-sm font-medium text-slate-600 hover:text-hive-yellow-600 transition-colors">Login</a>
              <a routerLink="/register" class="rounded-full bg-hive-yellow px-6 py-2.5 text-xs font-bold text-hive-dark shadow-xl shadow-amber-500/30 hover:bg-hive-yellow-300 hover:scale-105 transition-all">
                Join Hive
              </a>
           }
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  dataService = inject(DataService);
  private router: Router = inject(Router);

  logout() {
    this.dataService.logout();
    this.router.navigate(['/']);
  }
}