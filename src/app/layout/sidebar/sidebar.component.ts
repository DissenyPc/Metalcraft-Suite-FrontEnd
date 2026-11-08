import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <!-- Brand Header -->
      <div class="sidebar-brand">
        <div class="brand-icon">
          <i class="bi bi-tools"></i>
        </div>
        <div class="brand-text" *ngIf="!isCollapsed">
          <span class="brand-name">Carpintería</span>
          <span class="brand-sub">Metálica & Cerrajería</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          @for (item of visibleNavItems; track item.route) {
            <li class="nav-item">
              <a [routerLink]="item.route"
                 routerLinkActive="active"
                 [routerLinkActiveOptions]="{exact: item.route === '/'}"
                 class="nav-link"
                 [title]="isCollapsed ? item.label : ''">
                <i class="bi {{item.icon}}"></i>
                <span class="nav-label" *ngIf="!isCollapsed">{{ item.label }}</span>
                @if (item.adminOnly && !isCollapsed) {
                  <span class="admin-badge">
                    <i class="bi bi-shield-fill-check"></i>
                  </span>
                }
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- Collapse Toggle -->
      <button class="sidebar-toggle" (click)="toggleSidebar()">
        <i class="bi" [ngClass]="isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
      </button>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      min-height: 100vh;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 1000;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .sidebar.collapsed {
      width: 72px;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .brand-icon {
      width: 42px;
      height: 42px;
      min-width: 42px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0284c7, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: #fff;
      box-shadow: 0 2px 8px rgba(2,132,199,0.35);
    }
    .brand-text {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      white-space: nowrap;
    }
    .brand-name {
      font-size: 1rem;
      font-weight: 700;
      color: #f1f5f9;
      line-height: 1.2;
    }
    .brand-sub {
      font-size: 0.7rem;
      color: #94a3b8;
      font-weight: 400;
    }

    .sidebar-nav {
      flex: 1;
      padding: 0.75rem 0;
    }
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.15rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      border: none;
      background: none;
      width: 100%;
      cursor: pointer;
      transition: all 0.15s ease;
      border-left: 3px solid transparent;
      position: relative;
    }
    .nav-link i:first-child {
      font-size: 1.15rem;
      min-width: 22px;
      text-align: center;
    }
    .nav-link:hover {
      color: #e2e8f0;
      background: rgba(255,255,255,0.05);
    }
    .nav-link.active {
      color: #ffffff;
      background: rgba(2,132,199,0.15);
      border-left-color: #0284c7;
    }
    .nav-link.active i:first-child {
      color: #38bdf8;
    }

    .admin-badge {
      margin-left: auto;
      font-size: 0.7rem;
      color: #f59e0b;
      opacity: 0.7;
    }

    .sidebar-toggle {
      padding: 0.85rem;
      border: none;
      background: rgba(255,255,255,0.04);
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 1px solid rgba(255,255,255,0.06);
      transition: all 0.15s ease;
    }
    .sidebar-toggle:hover {
      color: #e2e8f0;
      background: rgba(255,255,255,0.08);
    }
  `]
})
export class SidebarComponent {
  isCollapsed = false;

  navItems: NavItem[] = [
    { label: 'Panel de Control', icon: 'bi-grid-1x2-fill', route: '/' },
    { label: 'Presupuestos', icon: 'bi-receipt-cutoff', route: '/budgets' },
    { label: 'Productos Especiales', icon: 'bi-grid-3x3', route: '/special-products' },
    { label: 'Artículos de Reventa', icon: 'bi-cart-check-fill', route: '/resale-items' },
    { label: 'Inventario y Tarifas', icon: 'bi-boxes', route: '/inventory', adminOnly: true },
    { label: 'Clientes', icon: 'bi-people-fill', route: '/clients', adminOnly: true },
    { label: 'Usuarios', icon: 'bi-people-fill', route: '/users', adminOnly: true }
  ];

  constructor(private authService: AuthService) {}

  /**
   * Returns only the nav items visible to the current user's role.
   * ADMIN sees everything, EMPLOYEE sees items without adminOnly flag.
   */
  get visibleNavItems(): NavItem[] {
    if (this.authService.isAdmin) {
      return this.navItems;
    }
    return this.navItems.filter(item => !item.adminOnly);
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
