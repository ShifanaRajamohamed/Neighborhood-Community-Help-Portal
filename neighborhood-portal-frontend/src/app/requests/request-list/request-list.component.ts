import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService } from '../../core/services/request.service';
import { AuthService } from '../../core/services/auth.service';
import { HelpRequest, RequestStatus, UserRole } from '../../shared/models/types';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestListComponent implements OnInit {
  requests: HelpRequest[] = [];
  loading = true;
  currentUserRole: UserRole | null = null;

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserRole = user?.role || null;
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.loading = false;
      return;
    }

    const filters: any = {};

    if (user.role === UserRole.RESIDENT) {
      filters.resident_id = user.id;
    } else if (user.role === UserRole.HELPER) {
      // Show available requests or assigned to this helper
    }

    this.requestService.getRequests(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.requests = response.data;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.markForCheck();
        this.snackBar.open('Failed to load requests', 'Close', { duration: 3000 });
      }
    });
  }

  acceptRequest(requestId: number): void {
    this.requestService.acceptRequest(requestId).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Request accepted!', 'Close', { duration: 2000 });
          this.loadRequests();
        }
      },
      error: (error) => {
        const message = error.error?.error || 'Failed to accept request';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
    });
  }

  startProgress(requestId: number): void {
    this.requestService.startProgress(requestId).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Request marked as in progress!', 'Close', { duration: 2000 });
          this.loadRequests();
        }
      },
      error: (error) => {
        const message = error.error?.error || 'Failed to update status';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
    });
  }

  completeRequest(requestId: number): void {
    this.requestService.completeRequest(requestId).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Request marked as completed!', 'Close', { duration: 2000 });
          this.loadRequests();
        }
      },
      error: (error) => {
        const message = error.error?.error || 'Failed to complete request';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
    });
  }

  getStatusClass(status: RequestStatus): string {
    return `status-${status.replace('_', '-')}`;
  }

  getStatusLabel(status: RequestStatus): string {
    return status.replace('_', ' ').toUpperCase();
  }
}
