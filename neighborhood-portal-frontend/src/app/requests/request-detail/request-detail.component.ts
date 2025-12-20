import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { RequestService } from '../../core/services/request.service';
import { AuthService } from '../../core/services/auth.service';
import { HelpRequest, RequestStatus, UserRole } from '../../shared/models/types';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestDetailComponent implements OnInit {
  request: HelpRequest | null = null;
  loading = true;
  currentUserRole: UserRole | null = null;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserRole = user?.role || null;
    this.currentUserId = user?.id || null;

    const requestId = this.route.snapshot.paramMap.get('id');
    if (requestId) {
      this.loadRequest(parseInt(requestId, 10));
    } else {
      this.router.navigate(['/requests']);
    }
  }

  loadRequest(id: number): void {
    this.loading = true;
    this.requestService.getRequestById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.request = response.data;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.markForCheck();
        this.snackBar.open('Failed to load request details', 'Close', { duration: 3000 });
        this.router.navigate(['/requests']);
      }
    });
  }

  getStatusClass(status: RequestStatus): string {
    const statusClasses: Record<RequestStatus, string> = {
      [RequestStatus.PENDING]: 'status-pending',
      [RequestStatus.ACCEPTED]: 'status-accepted',
      [RequestStatus.IN_PROGRESS]: 'status-in-progress',
      [RequestStatus.COMPLETED]: 'status-completed'
    };
    return statusClasses[status] || '';
  }

  getStatusLabel(status: RequestStatus): string {
    const statusLabels: Record<RequestStatus, string> = {
      [RequestStatus.PENDING]: 'PENDING',
      [RequestStatus.ACCEPTED]: 'ACCEPTED',
      [RequestStatus.IN_PROGRESS]: 'IN PROGRESS',
      [RequestStatus.COMPLETED]: 'COMPLETED'
    };
    return statusLabels[status] || status;
  }

  acceptRequest(): void {
    if (!this.request) return;
    
    this.requestService.acceptRequest(this.request.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Request accepted!', 'Close', { duration: 2000 });
          this.loadRequest(this.request!.id);
        }
      },
      error: (error) => {
        const message = error.error?.error || 'Failed to accept request';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
    });
  }

  startProgress(): void {
    if (!this.request) return;
    
    this.requestService.startProgress(this.request.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Request marked as in progress!', 'Close', { duration: 2000 });
          this.loadRequest(this.request!.id);
        }
      },
      error: (error) => {
        const message = error.error?.error || 'Failed to update status';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
    });
  }

  completeRequest(): void {
    if (!this.request) return;
    
    this.requestService.completeRequest(this.request.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Request marked as completed!', 'Close', { duration: 2000 });
          this.loadRequest(this.request!.id);
        }
      },
      error: (error) => {
        const message = error.error?.error || 'Failed to complete request';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/requests']);
  }

  // Stepper helper methods
  getStepperProgress(): string {
    if (!this.request) return '0%';
    const statusOrder = ['pending', 'accepted', 'in_progress', 'completed'];
    const index = statusOrder.indexOf(this.request.status);
    if (index === -1) return '0%';
    return `${(index / (statusOrder.length - 1)) * 100}%`;
  }

  isStepActive(step: string): boolean {
    return this.request?.status === step;
  }

  isStepCompleted(step: string): boolean {
    if (!this.request) return false;
    const statusOrder = ['pending', 'accepted', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(this.request.status);
    const stepIndex = statusOrder.indexOf(step);
    return stepIndex < currentIndex;
  }
}
