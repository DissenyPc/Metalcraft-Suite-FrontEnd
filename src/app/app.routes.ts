import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BudgetListComponent } from './pages/budget/budget-list/budget-list.component';
import { BudgetEditorComponent } from './pages/budget/budget-editor/budget-editor.component';
import { BudgetItemFormComponent } from './pages/budget/budget-item-form/budget-item-form.component';
import { SpecialProductsComponent } from './pages/special-products/special-products.component';
import { ResaleItemsComponent } from './pages/resale-items/resale-items.component';
import { InventoryDashboardComponent } from './pages/inventory/inventory-dashboard.component';
import { ClientManagementComponent } from './pages/clients/client-management.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  // ── Public Auth Routes ──
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ── Protected Routes (require authentication) ──
  { path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'budgets', component: BudgetListComponent, canActivate: [authGuard] },
  { path: 'budgets/new', component: BudgetEditorComponent, canActivate: [authGuard] },
  { path: 'budgets/:id', component: BudgetEditorComponent, canActivate: [authGuard] },
  { path: 'budgets/:id/calculator', component: BudgetItemFormComponent, canActivate: [authGuard] },
  { path: 'special-products', component: SpecialProductsComponent, canActivate: [authGuard] },
  { path: 'resale-items', component: ResaleItemsComponent, canActivate: [authGuard] },

  // ── ADMIN-only Routes ──
  {
    path: 'users',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'inventory',
    component: InventoryDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'clients',
    component: ClientManagementComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },

  // ── Legacy redirects ──
  { path: 'profiles', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'profiles/aluminium', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'profiles/iron', redirectTo: 'inventory', pathMatch: 'full' },
  // { path: 'hardware', redirectTo: 'inventory', pathMatch: 'full' },
  // { path: 'filling-materials', redirectTo: 'inventory', pathMatch: 'full' },
{
  path: 'inventory/:category',
  component: InventoryDashboardComponent, // o InventoryComponent, según se llame tu componente
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN'] }
},

  // ── Catch-all ──
  { path: '**', redirectTo: '' }
];