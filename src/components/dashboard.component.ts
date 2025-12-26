import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DataService } from '../frontend/services/data.service';
import { RequestCardComponent } from './request-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RequestCardComponent, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-10">
      <header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Welcome, {{ user()?.name }}
            <span class="ml-2 inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              {{ user()?.role | titlecase }}
            </span>
          </h1>
        </div>
      </header>
      
      <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        
        <!-- ADMIN STATS VIEW -->
        @if (user()?.role === 'admin') {
          <div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt class="truncate text-sm font-medium text-gray-500">Total Requests</dt>
              <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{{ dataService.stats().total }}</dd>
            </div>
             <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt class="truncate text-sm font-medium text-gray-500">Pending</dt>
              <dd class="mt-1 text-3xl font-semibold tracking-tight text-yellow-600">{{ dataService.stats().pending }}</dd>
            </div>
             <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt class="truncate text-sm font-medium text-gray-500">Active</dt>
              <dd class="mt-1 text-3xl font-semibold tracking-tight text-blue-600">{{ dataService.stats().active }}</dd>
            </div>
             <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt class="truncate text-sm font-medium text-gray-500">Completed</dt>
              <dd class="mt-1 text-3xl font-semibold tracking-tight text-green-600">{{ dataService.stats().completed }}</dd>
            </div>
          </div>
          
          <h2 class="text-xl font-bold text-gray-900 mb-4">All System Requests</h2>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
             @for (req of dataService.requests(); track req.id) {
                <app-request-card [request]="req"></app-request-card>
             }
          </div>
        }

        <!-- REQUESTER VIEW -->
        @if (user()?.role === 'requester') {
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">My Requests</h2>
            <a routerLink="/create-request" class="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
              New Request
            </a>
          </div>

          @if (dataService.myRequests().length === 0) {
             <div class="text-center py-12 bg-white rounded-lg shadow">
                <p class="text-gray-500">You haven't made any requests yet.</p>
             </div>
          }

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
             @for (req of dataService.myRequests(); track req.id) {
                <app-request-card [request]="req"></app-request-card>
             }
          </div>
        }

        <!-- HELPER VIEW -->
        @if (user()?.role === 'helper') {
          <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Requests Assigned To Me</h2>
             @if (dataService.myRequests().length === 0) {
                 <p class="text-gray-500 text-sm">You have no active tasks.</p>
             }
             <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
               @for (req of dataService.myRequests(); track req.id) {
                  <app-request-card [request]="req"></app-request-card>
               }
             </div>
          </div>

          <div class="border-t pt-8">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Available Community Requests</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
               @for (req of dataService.availableRequests(); track req.id) {
                  <app-request-card [request]="req"></app-request-card>
               }
               @if (dataService.availableRequests().length === 0) {
                  <p class="text-gray-500 col-span-3 text-center py-4">No pending requests in the neighborhood right now. Great job!</p>
               }
            </div>
          </div>
        }

      </main>
    </div>
  `
})
export class DashboardComponent {
  dataService = inject(DataService);
  private router: Router = inject(Router);
  
  user = this.dataService.currentUser;

  constructor() {
    // Basic auth guard simulation
    if (!this.dataService.currentUser()) {
        this.router.navigate(['/login']);
    }
  }
}
