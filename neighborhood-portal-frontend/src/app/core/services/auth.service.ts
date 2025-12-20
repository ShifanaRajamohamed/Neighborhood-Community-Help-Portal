import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { User, AuthResponse, CreateUserDTO, LoginDTO, ApiResponse, UserRole } from '../../shared/models/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  register(userData: CreateUserDTO): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${environment.apiUrl}/users/register`,
      userData
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.storeAuthData(response.data);
        }
      })
    );
  }

  login(credentials: LoginDTO): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${environment.apiUrl}/users/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.storeAuthData(response.data);
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  private storeAuthData(authData: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Storing auth data', { user: authData.user.name, hasToken: !!authData.token });
      localStorage.setItem(this.TOKEN_KEY, authData.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
    } else {
      console.log('Not storing auth data - not in browser');
    }
    this.currentUserSubject.next(authData.user);
  }
}
