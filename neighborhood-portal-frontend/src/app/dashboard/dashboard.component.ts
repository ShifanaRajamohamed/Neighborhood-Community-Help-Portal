import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/services/auth.service';
import { RequestService } from '../core/services/request.service';
import { User, HelpRequest, UserRole } from '../shared/models/types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  requests: HelpRequest[] = [];
  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  };

  constructor(
    private authService: AuthService,
    private requestService: RequestService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    if (!this.currentUser) return;

    const filters: any = {};
    if (this.currentUser.role === UserRole.RESIDENT) {
      filters.resident_id = this.currentUser.id;
    } else if (this.currentUser.role === UserRole.HELPER) {
      filters.helper_id = this.currentUser.id;
    }

    this.requestService.getRequests(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.requests = response.data!.slice(0, 5);
          this.calculateStats(response.data!);
          this.cdr.markForCheck();
        }
      }
    });
  }

  calculateStats(requests: HelpRequest[]): void {
    this.stats.total = requests.length;
    this.stats.pending = requests.filter(r => r.status === 'pending').length;
    this.stats.inProgress = requests.filter(r => r.status === 'in_progress').length;
    this.stats.completed = requests.filter(r => r.status === 'completed').length;
  }

  logout(): void {
    this.authService.logout();
  }

  get isResident(): boolean {
    return this.currentUser?.role === UserRole.RESIDENT;
  }

  get isHelper(): boolean {
    return this.currentUser?.role === UserRole.HELPER;
  }
}
