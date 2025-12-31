import { Component, inject, effect, viewChild, ElementRef, OnDestroy, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { RequestCardComponent } from './request-card.component';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { User } from '../../shared/types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RequestCardComponent, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 py-12">
      <!-- Header Section -->
      <header class="bg-white shadow-sm border-b border-slate-100">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Dashboard</p>
              <h1 class="text-3xl font-serif font-bold text-hive-dark">
                Welcome, <span class="text-transparent bg-clip-text bg-gradient-to-r from-hive-yellow-500 to-amber-600">{{ user()?.name }}</span>
              </h1>
            </div>
            <div class="hidden sm:block">
              <span class="inline-flex items-center rounded-full bg-hive-dark px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-gray-900/20">
                {{ user()?.role | titlecase }} Account
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 pb-20">
        
        <!-- ADMIN VIEW -->
        @if (user()?.role === 'admin') {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div class="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative hover:shadow-md transition-all">
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest pl-2 mb-2">Request Status Distribution</h3>
                <div class="h-64 w-full relative">
                   <canvas #statsChart></canvas>
                </div>
            </div>
            <div class="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Pending Approvals</h3>
                <p class="text-5xl font-serif font-bold text-hive-dark">{{ dataService.unapprovedHelpers().length }}</p>
                <p class="text-slate-500 mt-1">Helpers waiting for review</p>
              </div>
              <button (click)="scrollToApprovals()" class="mt-6 w-full text-center rounded-full bg-hive-yellow hover:bg-hive-yellow-500 py-3 text-sm font-bold text-hive-dark shadow-lg shadow-amber-500/30 transition-all">
                Review Helpers
              </button>
            </div>
          </div>

          <div id="approvals-section" class="mb-12 scroll-mt-24">
            <h2 class="text-2xl font-bold text-hive-dark font-serif mb-6">Helper Management</h2>
            <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="bg-slate-50/80 border-b border-slate-100">
                      <th class="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Helper</th>
                      <th class="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                      <th class="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Address</th>
                      <th class="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    @for(helper of helpers(); track helper.id) {
                      <tr class="hover:bg-slate-50/50">
                        <td class="p-4 font-bold text-slate-700">{{helper.name}}</td>
                        <td class="p-4 text-slate-600">{{helper.email}}</td>
                        <td class="p-4 text-slate-600">{{helper.fullAddress}}</td>
                        <td class="p-4 text-center">
                          @if (helper.isApproved) {
                             <span class="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Approved</span>
                          } @else {
                             <button (click)="approveHelper(helper.id)" class="rounded-md bg-hive-yellow-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-400">Approve</button>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-hive-dark font-serif mb-6">All System Requests</h2>
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
             @for (req of dataService.requests(); track req.id) {
                <app-request-card [request]="req"></app-request-card>
             }
          </div>
        }

        <!-- REQUESTER VIEW -->
        @if (user()?.role === 'requester') {
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold text-hive-dark font-serif">My Requests</h2>
            <a routerLink="/create-request" class="rounded-full bg-hive-yellow px-6 py-3 text-sm font-bold text-hive-dark shadow-lg shadow-amber-500/30 hover:bg-hive-yellow-300 hover:scale-105 transition-all">
              + New Request
            </a>
          </div>

          @if (dataService.myRequests().length === 0) {
             <div class="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300">
                <h3 class="mt-2 text-sm font-semibold text-hive-dark">No requests</h3>
                <p class="mt-1 text-sm text-slate-500">Get started by creating a new help request.</p>
             </div>
          } @else {
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
               @for (req of dataService.myRequests(); track req.id) {
                  <app-request-card [request]="req"></app-request-card>
               }
            </div>
          }
        }

        <!-- HELPER VIEW -->
        @if (user()?.role === 'helper') {
          @if (!user()?.isApproved) {
            <div class="text-center py-24 bg-white rounded-[2rem] border border-amber-300">
                <h3 class="mt-2 text-lg font-semibold text-amber-900">Account Pending Approval</h3>
                <p class="mt-1 text-sm text-slate-600">An administrator is reviewing your profile. You will be able to view and offer help on requests once approved.</p>
             </div>
          } @else {
            <div class="mb-16">
              <h2 class="text-2xl font-bold text-hive-dark font-serif mb-6 pl-4 border-l-4 border-hive-yellow-500">Community Board</h2>
              @if (dataService.availableRequests().length === 0) {
                  <div class="col-span-full py-12 text-center bg-amber-50/50 rounded-3xl border border-amber-100">
                    <p class="text-amber-800 font-medium">No pending requests in the neighborhood. Great job!</p>
                  </div>
              } @else {
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                   @for (req of dataService.availableRequests(); track req.id) {
                      <app-request-card [request]="req"></app-request-card>
                   }
                </div>
              }
            </div>

            @if (dataService.myRequests().length > 0) {
              <div>
                <h2 class="text-2xl font-bold text-hive-dark font-serif mb-6 pl-4 border-l-4 border-amber-500">My Accepted Tasks</h2>
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  @for (req of dataService.myRequests(); track req.id) {
                      <app-request-card [request]="req"></app-request-card>
                  }
                </div>
              </div>
            }
          }
        }
      </main>
    </div>
  `
})
export class DashboardComponent implements OnDestroy {
  dataService = inject(DataService);
  private router: Router = inject(Router);
  
  user = this.dataService.currentUser;
  helpers = computed(() => this.dataService.users().filter(u => u.role === 'helper'));

  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('statsChart');
  chart: Chart | null = null;

  constructor() {
    if (!this.dataService.currentUser()) {
        this.router.navigate(['/login']);
    }

    effect(() => {
       const canvas = this.canvasRef()?.nativeElement;
       const stats = this.dataService.stats();
       if (canvas) {
           if (this.chart) {
               this.updateChartData(stats);
           } else {
               this.createChart(canvas, stats);
           }
       } else if (this.chart) {
           this.chart.destroy();
           this.chart = null;
       }
    });
  }

  createChart(canvas: HTMLCanvasElement, stats: any) {
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Pending', 'Active', 'Completed'],
        datasets: [{
          label: 'Requests',
          data: [stats.pending, stats.active, stats.completed],
          backgroundColor: [ 'rgba(251, 191, 36, 0.8)', 'rgba(31, 41, 55, 0.8)', 'rgba(202, 138, 4, 0.8)' ],
          borderRadius: 8,
          barPercentage: 0.6
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  }

  updateChartData(stats: any) {
    if (this.chart) {
      this.chart.data.datasets[0].data = [stats.pending, stats.active, stats.completed];
      this.chart.update();
    }
  }

  approveHelper(helperId: number) {
    this.dataService.approveHelper(helperId);
  }

  scrollToApprovals() {
    document.getElementById('approvals-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}