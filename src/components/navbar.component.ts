
import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DataService } from '../frontend/services/data.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <nav class="bg-emerald-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex-shrink-0 font-bold text-xl flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Neighborhood Portal
            </a>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              @if (dataService.currentUser()) {
                <a routerLink="/dashboard" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Dashboard</a>
                @if (dataService.currentUser()?.role === 'resident') {
                   <a routerLink="/create-request" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Ask For Help</a>
                }
                <button (click)="logout()" class="px-3 py-2 rounded-md text-sm font-medium bg-emerald-800 hover:bg-emerald-700">Logout</button>
              } @else {
                <a routerLink="/login" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-500">Login</a>
                <a routerLink="/register" class="bg-white text-emerald-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">Sign Up</a>
              }
            </div>
          </div>
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
