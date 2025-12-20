import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService } from '../../core/services/request.service';

@Component({
  selector: 'app-help-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './help-request.component.html',
  styleUrls: ['./help-request.component.css']
})
export class HelpRequestComponent implements OnInit {
  requestForm!: FormGroup;
  isSubmitting = false;

  categories = [
    'Plumbing',
    'Electrical',
    'Grocery Shopping',
    'Tutoring',
    'Pet Care',
    'Lawn Care',
    'Moving Help',
    'Tech Support',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      attachments: ['']
    });
  }

  onSubmit(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.requestService.createRequest(this.requestForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Help request created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        const message = error.error?.error || 'Failed to create request. Please try again.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }
}
