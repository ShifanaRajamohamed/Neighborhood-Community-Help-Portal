import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AdminService, AdminRequestFilters } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { HelpRequest, RequestStatus, User } from '../../shared/models/types';

@Component({
  selector: 'app-admin-requests',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './admin-requests.component.html',
  styleUrls: ['./admin-requests.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminRequestsComponent implements OnInit {
  currentUser: User | null = null;
  requests: HelpRequest[] = [];
  displayedColumns: string[] = ['id', 'title', 'category', 'status', 'resident', 'helper', 'created', 'actions'];

  // Filters
  statusFilter = new FormControl<RequestStatus | ''>('');
  categoryFilter = new FormControl('');
  startDateFilter = new FormControl<Date | null>(null);
  endDateFilter = new FormControl<Date | null>(null);

  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: RequestStatus.PENDING, label: 'Pending' },
    { value: RequestStatus.ACCEPTED, label: 'Accepted' },
    { value: RequestStatus.IN_PROGRESS, label: 'In Progress' },
    { value: RequestStatus.COMPLETED, label: 'Completed' }
  ];

  categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'errands', label: 'Errands' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRequests();
    this.setupFilterSubscriptions();
  }

  setupFilterSubscriptions(): void {
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
    this.categoryFilter.valueChanges.subscribe(() => this.applyFilters());
    this.startDateFilter.valueChanges.subscribe(() => this.applyFilters());
    this.endDateFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  loadRequests(filters?: AdminRequestFilters): void {
    this.adminService.getAllRequests(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.requests = response.data;
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error loading requests:', error);
      }
    });
  }

  applyFilters(): void {
    const filters: AdminRequestFilters = {};

    if (this.statusFilter.value) {
      filters.status = this.statusFilter.value as RequestStatus;
    }

    if (this.categoryFilter.value) {
      filters.category = this.categoryFilter.value;
    }

    if (this.startDateFilter.value) {
      filters.startDate = this.startDateFilter.value.toISOString();
    }

    if (this.endDateFilter.value) {
      filters.endDate = this.endDateFilter.value.toISOString();
    }

    this.loadRequests(filters);
  }

  clearFilters(): void {
    this.statusFilter.setValue('');
    this.categoryFilter.setValue('');
    this.startDateFilter.setValue(null);
    this.endDateFilter.setValue(null);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
