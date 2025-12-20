import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AdminService, AdminDashboardStats } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/types';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats: AdminDashboardStats = {
    total: 0,
    pending: 0,
    accepted: 0,
    in_progress: 0,
    completed: 0,
    recent_requests: []
  };
  displayedColumns: string[] = ['id', 'title', 'status', 'resident', 'created'];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
