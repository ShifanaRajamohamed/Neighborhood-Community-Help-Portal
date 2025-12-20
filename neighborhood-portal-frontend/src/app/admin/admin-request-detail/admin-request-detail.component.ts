import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { HelpRequest, RequestStatus, User } from '../../shared/models/types';

@Component({
  selector: 'app-admin-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatStepperModule
  ],
  templateUrl: './admin-request-detail.component.html',
  styleUrls: ['./admin-request-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminRequestDetailComponent implements OnInit {
  currentUser: User | null = null;
  request: HelpRequest | null = null;
  requestId: number = 0;
  statusControl = new FormControl<RequestStatus>(RequestStatus.PENDING);

  statusOptions = [
    { value: RequestStatus.PENDING, label: 'Pending' },
    { value: RequestStatus.ACCEPTED, label: 'Accepted' },
    { value: RequestStatus.IN_PROGRESS, label: 'In Progress' },
    { value: RequestStatus.COMPLETED, label: 'Completed' }
  ];

  RequestStatus = RequestStatus;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRequest();
  }

  loadRequest(): void {
    this.adminService.getRequestById(this.requestId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.request = response.data;
          this.statusControl.setValue(response.data.status);
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error loading request:', error);
        this.snackBar.open('Error loading request details', 'Close', { duration: 3000 });
      }
    });
  }

  updateStatus(): void {
    if (!this.statusControl.value) return;

    const newStatus = this.statusControl.value;

    this.adminService.updateRequestStatus(this.requestId, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Status updated successfully', 'Close', { duration: 3000 });
          this.loadRequest();
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.snackBar.open('Error updating status', 'Close', { duration: 3000 });
      }
    });
  }

  archiveRequest(): void {
    if (!confirm('Are you sure you want to archive this request? This action cannot be undone.')) {
      return;
    }

    this.adminService.archiveRequest(this.requestId).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Request archived successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/requests']);
        }
      },
      error: (error) => {
        console.error('Error archiving request:', error);
        this.snackBar.open('Error archiving request', 'Close', { duration: 3000 });
      }
    });
  }

  getStatusStep(status: RequestStatus): number {
    const steps = {
      [RequestStatus.PENDING]: 0,
      [RequestStatus.ACCEPTED]: 1,
      [RequestStatus.IN_PROGRESS]: 2,
      [RequestStatus.COMPLETED]: 3
    };
    return steps[status] || 0;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
