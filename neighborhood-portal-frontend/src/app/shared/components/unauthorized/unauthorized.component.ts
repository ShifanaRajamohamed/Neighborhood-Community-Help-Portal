import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="unauthorized-page">
      <div class="unauthorized-content">
        <span class="unauthorized-icon">🚫</span>
        <h1>Unauthorized Access</h1>
        <p>You don't have permission to access this page.</p>
        <div class="unauthorized-actions">
          <a routerLink="/dashboard" class="btn btn-primary">Go to Dashboard</a>
          <a routerLink="/" class="btn btn-secondary">Back to Home</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: var(--space-6);
      background: var(--color-bg);
    }

    .unauthorized-content {
      max-width: 400px;
      text-align: center;
      padding: var(--space-8);
      background: var(--color-bg-elevated);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
    }

    .unauthorized-icon {
      font-size: 48px;
      display: block;
      margin-bottom: var(--space-4);
    }

    h1 {
      font-size: var(--text-2xl);
      font-weight: var(--font-semibold);
      color: var(--color-fg);
      margin-bottom: var(--space-3);
    }

    p {
      font-size: var(--text-base);
      color: var(--color-fg-muted);
      margin-bottom: var(--space-6);
    }

    .unauthorized-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
  `]
})
export class UnauthorizedComponent { }
