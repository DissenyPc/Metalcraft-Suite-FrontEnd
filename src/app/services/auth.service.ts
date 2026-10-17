import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { API_CONFIG } from './api.config';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Central authentication service.
 * Manages JWT tokens, user state, login/register/logout operations.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Returns the current user synchronously (snapshot).
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Returns true if a user is currently authenticated.
   */
  get isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUser;
  }

  /**
   * Returns true if the current user has ADMIN role.
   */
  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  /**
   * Returns true if the current user has EMPLOYEE role.
   */
  get isEmployee(): boolean {
    return this.currentUser?.role === 'EMPLOYEE';
  }

  /**
   * Returns the stored JWT token.
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Authenticates user with username and password.
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_CONFIG.baseUrl}/auth/login`, request).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  /**
   * Registers a new user account (always as EMPLOYEE).
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_CONFIG.baseUrl}/auth/register`, request).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  /**
   * Logs out the current user, clears storage, and redirects to login.
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Checks if the current user has one of the given roles.
   */
  hasRole(...roles: string[]): boolean {
    const user = this.currentUser;
    return !!user && roles.includes(user.role);
  }

  // ── Private helpers ──

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);

    const user: User = {
      username: response.username,
      email: response.email,
      role: response.role
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): User | null {
    try {
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        return JSON.parse(userData) as User;
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
    return null;
  }
}
