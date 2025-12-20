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
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../shared/models/types';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatSnackBarModule
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  isSubmitting = false;
  roles = [
    { value: UserRole.RESIDENT, label: 'Resident (Request Help)' },
    { value: UserRole.HELPER, label: 'Helper (Provide Help)' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contact_info: ['', [Validators.required, Validators.email]],
      location: ['', [Validators.required, Validators.minLength(5)]],
      role: [UserRole.RESIDENT, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.markFormGroupTouched(this.registrationForm);
      return;
    }

    this.isSubmitting = true;
    const { confirmPassword, ...userData } = this.registrationForm.value;

    this.authService.register(userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        const message = error.error?.error || 'Registration failed. Please try again.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);

    if (!control || !control.touched) {
      return '';
    }

    if (control.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} characters required`;
    }

    if (fieldName === 'confirmPassword' && this.registrationForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      contact_info: 'Email',
      location: 'Location',
      role: 'Role',
      password: 'Password',
      confirmPassword: 'Confirm Password'
    };
    return labels[fieldName] || fieldName;
  }
}
