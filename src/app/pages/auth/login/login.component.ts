import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-container animate-fade-in">
        <!-- Brand Header -->
        <div class="auth-brand">
          <div class="brand-icon">
            <i class="bi bi-tools"></i>
          </div>
          <h1 class="brand-title">Carpintería Metálica</h1>
          <p class="brand-subtitle">& Cerrajería</p>
        </div>

        <!-- Login Card -->
        <div class="auth-card">
          <div class="auth-card-header">
            <h2>Iniciar Sesión</h2>
            <p>Ingrese sus credenciales para acceder al sistema</p>
          </div>

          <!-- Error Alert -->
          @if (errorMessage) {
            <div class="auth-alert error" id="login-error">
              <i class="bi bi-exclamation-triangle-fill"></i>
              <span>{{ errorMessage }}</span>
            </div>
          }

          <form (ngSubmit)="onLogin()" #loginForm="ngForm">
            <div class="form-group">
              <label for="username" class="form-label">
                <i class="bi bi-person"></i> Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                class="form-input"
                placeholder="Nombre de usuario"
                [(ngModel)]="credentials.username"
                required
                minlength="3"
                #usernameField="ngModel"
                [class.invalid]="usernameField.invalid && usernameField.touched"
                autocomplete="username"
              />
              @if (usernameField.invalid && usernameField.touched) {
                <small class="field-error">El usuario es obligatorio (mín. 3 caracteres)</small>
              }
            </div>

            <div class="form-group">
              <label for="password" class="form-label">
                <i class="bi bi-lock"></i> Contraseña
              </label>
              <div class="password-wrapper">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  class="form-input"
                  placeholder="Su contraseña"
                  [(ngModel)]="credentials.password"
                  required
                  minlength="6"
                  #passwordField="ngModel"
                  [class.invalid]="passwordField.invalid && passwordField.touched"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="password-toggle"
                  (click)="showPassword = !showPassword"
                  tabindex="-1"
                >
                  <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              @if (passwordField.invalid && passwordField.touched) {
                <small class="field-error">La contraseña es obligatoria (mín. 6 caracteres)</small>
              }
            </div>

            <button
              type="submit"
              id="btn-login"
              class="auth-btn"
              [disabled]="loginForm.invalid || isLoading"
            >
              @if (isLoading) {
                <span class="spinner"></span> Iniciando sesión...
              } @else {
                <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>¿No tiene cuenta? <a routerLink="/register" id="link-register">Registrarse</a></p>
          </div>
        </div>

        <!-- Demo Credentials -->
        <div class="demo-info">
          <p><i class="bi bi-info-circle"></i> Credenciales de prueba:</p>
          <div class="demo-creds">
            <button class="demo-btn" (click)="fillDemo('admin', 'admin123')">
              <span class="demo-role admin">ADMIN</span>
              admin / admin123
            </button>
            <button class="demo-btn" (click)="fillDemo('empleado', 'empleado123')">
              <span class="demo-role employee">EMPLOYEE</span>
              empleado / empleado123
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }
    .auth-page::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 30% 50%, rgba(2,132,199,0.08) 0%, transparent 50%),
                  radial-gradient(circle at 70% 50%, rgba(6,182,212,0.06) 0%, transparent 50%);
      animation: bgShift 20s ease-in-out infinite alternate;
    }
    @keyframes bgShift {
      0% { transform: translate(0, 0); }
      100% { transform: translate(-5%, 3%); }
    }

    .auth-container {
      width: 100%;
      max-width: 420px;
      position: relative;
      z-index: 1;
    }

    .auth-brand {
      text-align: center;
      margin-bottom: 2rem;
    }
    .brand-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #0284c7, #06b6d4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      color: #fff;
      box-shadow: 0 8px 24px rgba(2,132,199,0.35);
      margin-bottom: 1rem;
    }
    .brand-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #f1f5f9;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .brand-subtitle {
      font-size: 0.9rem;
      color: #64748b;
      margin: 0.25rem 0 0;
      font-weight: 400;
    }

    .auth-card {
      background: rgba(255,255,255,0.97);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
    }
    .auth-card-header {
      margin-bottom: 1.5rem;
    }
    .auth-card-header h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.25rem;
    }
    .auth-card-header p {
      font-size: 0.85rem;
      color: #64748b;
      margin: 0;
    }

    .auth-alert {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }
    .auth-alert.error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.82rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.4rem;
    }
    .form-label i {
      font-size: 0.9rem;
      color: #64748b;
    }
    .form-input {
      width: 100%;
      padding: 0.7rem 0.9rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      color: #0f172a;
      background: #f8fafc;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }
    .form-input:focus {
      outline: none;
      border-color: #0284c7;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(2,132,199,0.12);
    }
    .form-input.invalid {
      border-color: #ef4444;
    }
    .form-input.invalid:focus {
      box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
    }
    .field-error {
      display: block;
      font-size: 0.78rem;
      color: #ef4444;
      margin-top: 0.3rem;
    }

    .password-wrapper {
      position: relative;
    }
    .password-wrapper .form-input {
      padding-right: 2.5rem;
    }
    .password-toggle {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.3rem;
      font-size: 1rem;
      transition: color 0.15s;
    }
    .password-toggle:hover {
      color: #475569;
    }

    .auth-btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: #fff;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(2,132,199,0.3);
      margin-top: 0.5rem;
    }
    .auth-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(2,132,199,0.4);
    }
    .auth-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2.5px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
    }
    .auth-footer p {
      font-size: 0.85rem;
      color: #64748b;
      margin: 0;
    }
    .auth-footer a {
      color: #0284c7;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.15s;
    }
    .auth-footer a:hover {
      color: #0369a1;
      text-decoration: underline;
    }

    .demo-info {
      margin-top: 1.5rem;
      text-align: center;
    }
    .demo-info > p {
      font-size: 0.8rem;
      color: #64748b;
      margin: 0 0 0.6rem;
    }
    .demo-creds {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .demo-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      color: #94a3b8;
      font-size: 0.78rem;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .demo-btn:hover {
      background: rgba(255,255,255,0.15);
      color: #e2e8f0;
    }
    .demo-role {
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .demo-role.admin {
      background: rgba(245,158,11,0.2);
      color: #f59e0b;
    }
    .demo-role.employee {
      background: rgba(16,185,129,0.2);
      color: #10b981;
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = { username: '', password: '' };
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // If already logged in, redirect to dashboard
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onLogin(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Credenciales inválidas. Verifique su usuario y contraseña.';
      }
    });
  }

  fillDemo(username: string, password: string): void {
    this.credentials = { username, password };
  }
}
