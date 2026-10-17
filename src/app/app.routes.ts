import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BudgetListComponent } from './pages/budget/budget-list/budget-list.component';
import { BudgetEditorComponent } from './pages/budget/budget-editor/budget-editor.component';
import { BudgetItemFormComponent } from './pages/budget/budget-item-form/budget-item-form.component';
import { SpecialProductsComponent } from './pages/special-products/special-products.component';
import { ResaleItemsComponent } from './pages/resale-items/resale-items.component';
import { InventoryDashboardComponent } from './pages/inventory/inventory-dashboard.component';
import { ClientManagementComponent } from './pages/clients/client-management.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'budgets', component: BudgetListComponent },
  { path: 'budgets/new', component: BudgetEditorComponent },
  { path: 'budgets/:id', component: BudgetEditorComponent },
  { path: 'budgets/:id/calculator', component: BudgetItemFormComponent },
  { path: 'special-products', component: SpecialProductsComponent },
  { path: 'resale-items', component: ResaleItemsComponent },
  { path: 'inventory', component: InventoryDashboardComponent },
  { path: 'profiles', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'profiles/aluminium', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'profiles/iron', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'hardware', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'filling-materials', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'clients', component: ClientManagementComponent },
  { path: '**', redirectTo: '' }
];
