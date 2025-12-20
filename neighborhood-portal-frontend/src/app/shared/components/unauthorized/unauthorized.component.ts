import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <div class="unauthorized-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <h1>Unauthorized Access</h1>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>You don't have permission to access this page.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/dashboard">
            Go to Dashboard
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: var(--spacing-lg);
    }

    mat-card {
      max-width: 500px;
      text-align: center;
    }

    h1 {
      color: var(--color-error);
    }
  `]
})
export class UnauthorizedComponent {}
