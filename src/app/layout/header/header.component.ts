import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header glass-panel">
      <div class="header-left">
        <h1 class="page-title" id="header-title">
          <ng-content select="[pageTitle]"></ng-content>
        </h1>
      </div>
      <div class="header-right">
        <div class="header-search">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="Buscar..." id="global-search" class="search-input">
        </div>
        <button class="icon-btn" id="btn-notifications" title="Notificaciones">
          <i class="bi bi-bell"></i>
          <span class="notification-dot"></span>
        </button>

        <!-- User Menu -->
        <div class="user-menu" (click)="toggleUserMenu()">
          <div class="user-avatar" id="user-avatar" [title]="authService.currentUser?.username || 'Mi Cuenta'">
            <span>{{ userInitials }}</span>
          </div>
          @if (showUserMenu) {
            <div class="user-dropdown animate-fade-in" id="user-dropdown">
              <div class="dropdown-header">
                <div class="dropdown-avatar">
                  <span>{{ userInitials }}</span>
                </div>
                <div class="dropdown-user-info">
                  <span class="dropdown-username">{{ authService.currentUser?.username }}</span>
                  <span class="dropdown-email">{{ authService.currentUser?.email }}</span>
                  <span class="role-badge" [class.admin]="authService.isAdmin" [class.employee]="authService.isEmployee">
                    <i class="bi" [ngClass]="authService.isAdmin ? 'bi-shield-fill-check' : 'bi-person-badge'"></i>
                    {{ authService.isAdmin ? 'Administrador' : 'Empleado' }}
                  </span>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" id="btn-logout" (click)="onLogout()">
                <i class="bi bi-box-arrow-right"></i>
                Cerrar Sesión
              </button>
            </div>
          }
        </div>
      </div>
    </header>

    <!-- Backdrop for closing dropdown -->
    @if (showUserMenu) {
      <div class="dropdown-backdrop" (click)="showUserMenu = false"></div>
    }
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .page-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .header-search {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f1f5f9;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 0.4rem 0.75rem;
      transition: all 0.2s ease;
    }
    .header-search:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(2,132,199,0.1);
      background: #fff;
    }
    .header-search i {
      color: #94a3b8;
      font-size: 0.9rem;
    }
    .search-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.88rem;
      color: var(--text-main);
      width: 180px;
    }
    .search-input::placeholder {
      color: #94a3b8;
    }
    .icon-btn {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      color: #475569;
      transition: all 0.15s ease;
    }
    .icon-btn:hover {
      background: #f1f5f9;
      color: var(--color-primary);
    }
    .notification-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background: var(--color-danger);
      border-radius: 50%;
      border: 2px solid #fff;
    }

    /* User Menu */
    .user-menu {
      position: relative;
    }
    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, #0284c7, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .user-avatar:hover {
      box-shadow: 0 0 0 3px rgba(2,132,199,0.2);
    }

    /* Dropdown */
    .user-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 280px;
      background: #fff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      z-index: 200;
    }
    .dropdown-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
    }
    .dropdown-avatar {
      width: 44px;
      height: 44px;
      min-width: 44px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0284c7, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 0.9rem;
    }
    .dropdown-user-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .dropdown-username {
      font-size: 0.9rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }
    .dropdown-email {
      font-size: 0.78rem;
      color: #64748b;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .role-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      margin-top: 0.3rem;
      width: fit-content;
    }
    .role-badge.admin {
      background: rgba(245,158,11,0.12);
      color: #d97706;
    }
    .role-badge.employee {
      background: rgba(16,185,129,0.12);
      color: #059669;
    }
    .dropdown-divider {
      height: 1px;
      background: #f1f5f9;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      width: 100%;
      font-size: 0.85rem;
      font-family: inherit;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .dropdown-item:hover {
      background: #f8fafc;
      color: #0f172a;
    }
    .dropdown-item.logout {
      color: #ef4444;
    }
    .dropdown-item.logout:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .dropdown-backdrop {
      position: fixed;
      inset: 0;
      z-index: 99;
    }
  `]
})
export class HeaderComponent {
  showUserMenu = false;

  constructor(public authService: AuthService) {}

  get userInitials(): string {
    const username = this.authService.currentUser?.username || '';
    return username.substring(0, 2).toUpperCase();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  onLogout(): void {
    this.showUserMenu = false;
    this.authService.logout();
  }
}
