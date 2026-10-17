import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
        <div class="user-avatar" id="user-avatar" title="Mi Cuenta">
          <span>CM</span>
        </div>
      </div>
    </header>
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
  `]
})
export class HeaderComponent {}
