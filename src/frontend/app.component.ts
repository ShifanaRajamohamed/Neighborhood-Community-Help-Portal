import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <div class="min-h-screen flex flex-col font-sans">
      @if (!isAuthPage()) {
        <app-navbar></app-navbar>
      }
      <div class="flex-grow">
        <router-outlet></router-outlet>
      </div>
      @if (!isAuthPage()) {
        <footer class="bg-white/80 border-t border-slate-100 mt-auto backdrop-blur-sm">
          <div class="mx-auto max-w-7xl px-6 py-8 flex flex-col items-center justify-center">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">&copy; 2024 Help Hive</p>
          </div>
        </footer>
      }
    </div>
  `
})
export class AppComponent {
  private router: Router = inject(Router);
  isAuthPage = signal(false);

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const urlPath = event.urlAfterRedirects.split('?')[0];
      this.isAuthPage.set(urlPath === '/login' || urlPath === '/register');
    });
  }
}