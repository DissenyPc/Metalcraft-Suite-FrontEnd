import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/user.model';

@Component({
  selector: 'app-register',
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

        <!-- Register Card -->
        <div class="auth-card">
          <div class="auth-card-header">
            <h2>Crear Cuenta</h2>
            <p>Complete los datos para registrarse en el sistema</p>
          </div>

          <!-- Error Alert -->
          @if (errorMessage) {
            <div class="auth-alert error" id="register-error">
              <i class="bi bi-exclamation-triangle-fill"></i>
              <span>{{ errorMessage }}</span>
            </div>
          }

          <!-- Success Alert -->
          @if (successMessage) {
            <div class="auth-alert success" id="register-success">
              <i class="bi bi-check-circle-fill"></i>
              <span>{{ successMessage }}</span>
            </div>
          }

          <form (ngSubmit)="onRegister()" #registerForm="ngForm">
            <div class="form-group">
              <label for="reg-username" class="form-label">
                <i class="bi bi-person"></i> Nombre de Usuario
              </label>
              <input
                type="text"
                id="reg-username"
                name="username"
                class="form-input"
                placeholder="Mínimo 3 caracteres"
                [(ngModel)]="formData.username"
                required
                minlength="3"
                maxlength="50"
                #usernameField="ngModel"
                [class.invalid]="usernameField.invalid && usernameField.touched"
                autocomplete="username"
              />
              @if (usernameField.invalid && usernameField.touched) {
                <small class="field-error">El usuario debe tener entre 3 y 50 caracteres</small>
              }
            </div>

            <div class="form-group">
              <label for="reg-email" class="form-label">
                <i class="bi bi-envelope"></i> Correo Electrónico
              </label>
              <input
                type="email"
                id="reg-email"
                name="email"
                class="form-input"
                placeholder="ejemplo&#64;correo.com"
                [(ngModel)]="formData.email"
                required
                email
                #emailField="ngModel"
                [class.invalid]="emailField.invalid && emailField.touched"
                autocomplete="email"
              />
              @if (emailField.invalid && emailField.touched) {
                <small class="field-error">Introduzca un email válido</small>
              }
            </div>

            <div class="form-group">
              <label for="reg-password" class="form-label">
                <i class="bi bi-lock"></i> Contraseña
              </label>
              <div class="password-wrapper">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="reg-password"
                  name="password"
                  class="form-input"
                  placeholder="Mínimo 6 caracteres"
                  [(ngModel)]="formData.password"
                  required
                  minlength="6"
                  maxlength="100"
                  #passwordField="ngModel"
                  [class.invalid]="passwordField.invalid && passwordField.touched"
                  autocomplete="new-password"
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
                <small class="field-error">La contraseña debe tener entre 6 y 100 caracteres</small>
              }
            </div>

            <div class="form-group">
              <label for="reg-confirm" class="form-label">
                <i class="bi bi-lock-fill"></i> Confirmar Contraseña
              </label>
              <div class="password-wrapper">
                <input
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  id="reg-confirm"
                  name="confirmPassword"
                  class="form-input"
                  placeholder="Repita la contraseña"
                  [(ngModel)]="confirmPassword"
                  required
                  #confirmField="ngModel"
                  [class.invalid]="(confirmField.touched && confirmPassword !== formData.password)"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="password-toggle"
                  (click)="showConfirmPassword = !showConfirmPassword"
                  tabindex="-1"
                >
                  <i class="bi" [ngClass]="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              @if (confirmField.touched && confirmPassword !== formData.password) {
                <small class="field-error">Las contraseñas no coinciden</small>
              }
            </div>

            <div class="role-info">
              <i class="bi bi-shield-check"></i>
              <span>Se le asignará el rol de <strong>Empleado</strong> por defecto. Un administrador puede cambiar su rol posteriormente.</span>
            </div>

            <button
              type="submit"
              id="btn-register"
              class="auth-btn"
              [disabled]="registerForm.invalid || isLoading || confirmPassword !== formData.password"
            >
              @if (isLoading) {
                <span class="spinner"></span> Registrando...
              } @else {
                <i class="bi bi-person-plus"></i> Crear Cuenta
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>¿Ya tiene cuenta? <a routerLink="/login" id="link-login">Iniciar Sesión</a></p>
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
    .auth-alert.success {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }

    .form-group {
      margin-bottom: 1.1rem;
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

    .role-info {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.65rem 0.85rem;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #1e40af;
      margin-bottom: 1.25rem;
    }
    .role-info i {
      font-size: 0.9rem;
      margin-top: 1px;
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
  `]
})
export class RegisterComponent {
  formData: RegisterRequest = { username: '', email: '', password: '' };
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onRegister(): void {
    if (this.confirmPassword !== this.formData.password) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.register(this.formData).subscribe({
      next: () => {
        this.successMessage = 'Cuenta creada correctamente. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/']), 1200);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al crear la cuenta. Inténtelo de nuevo.';
      }
    });
  }
}
