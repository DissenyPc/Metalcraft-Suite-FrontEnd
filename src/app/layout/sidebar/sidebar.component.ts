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
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
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
