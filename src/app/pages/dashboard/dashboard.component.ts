import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of, catchError } from 'rxjs';
import { AluminiumProfileService } from '../../services/aluminium-profile.service';
import { IronProfileService } from '../../services/iron-profile.service';
import { HardwareAccessoryService } from '../../services/hardware-accessory.service';
import { FillingMaterialService } from '../../services/filling-material.service';
import { BudgetService } from '../../services/budget.service';
import { ClientService } from '../../services/client.service';
import { Budget } from '../../models/budget.model';
import { HardwareAccessory } from '../../models/hardware-accessory.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard animate-fade-in">
      <!-- Stats Row -->
      <div class="row g-3 mb-4">
        <div class="col-lg-3 col-md-6">
          <div class="stat-widget card-interactive">
            <div class="stat-icon-wrapper" style="background: #e0f2fe; color: #0284c7;">
              <i class="bi bi-receipt-cutoff"></i>
            </div>
            <div>
              <div class="stat-value font-mono">{{ stats.budgets }}</div>
              <div class="stat-label">Presupuestos</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="stat-widget card-interactive">
            <div class="stat-icon-wrapper" style="background: #dbeafe; color: #2563eb;">
              <i class="bi bi-layers-half"></i>
            </div>
            <div>
              <div class="stat-value font-mono">{{ stats.aluminiumProfiles }}</div>
              <div class="stat-label">Perfiles Aluminio</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="stat-widget card-interactive">
            <div class="stat-icon-wrapper" style="background: #fef3c7; color: #d97706;">
              <i class="bi bi-hammer"></i>
            </div>
            <div>
              <div class="stat-value font-mono">{{ stats.ironProfiles }}</div>
              <div class="stat-label">Perfiles Hierro</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="stat-widget card-interactive">
            <div class="stat-icon-wrapper" style="background: #d1fae5; color: #059669;">
              <i class="bi bi-people-fill"></i>
            </div>
            <div>
              <div class="stat-value font-mono">{{ stats.clients }}</div>
              <div class="stat-label">Clientes</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Second Stats Row -->
      <div class="row g-3 mb-4">
        <div class="col-lg-3 col-md-6">
          <div class="stat-widget card-interactive">
            <div class="stat-icon-wrapper" style="background: #ede9fe; color: #7c3aed;">
              <i class="bi bi-gear-wide-connected"></i>
            </div>
            <div>
              <div class="stat-value font-mono">{{ stats.hardware }}</div>
              <div class="stat-label">Herrajes</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="stat-widget card-interactive">
            <div class="stat-icon-wrapper" style="background: #fce7f3; color: #db2777;">
              <i class="bi bi-window-stack"></i>
            </div>
            <div>
              <div class="stat-value font-mono">{{ stats.fillingMaterials }}</div>
              <div class="stat-label">Vidrios y Paneles</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <a routerLink="/hardware" class="stat-widget card-interactive text-decoration-none"
             [class.alert-stock]="lowStockItems.length > 0">
            <div class="stat-icon-wrapper" style="background: #fee2e2; color: #dc2626;">
              <i class="bi bi-exclamation-triangle-fill"></i>
            </div>
            <div>
              <div class="stat-value font-mono">{{ lowStockItems.length }}</div>
              <div class="stat-label">Stock Bajo</div>
            </div>
          </a>
        </div>
        <div class="col-lg-3 col-md-6">
          <a routerLink="/calculator/structure" class="stat-widget card-interactive text-decoration-none">
            <div class="stat-icon-wrapper" style="background: #ecfdf5; color: #10b981;">
              <i class="bi bi-calculator-fill"></i>
            </div>
            <div>
              <div class="stat-value" style="font-size: 1rem;">Abrir</div>
              <div class="stat-label">Calculadora</div>
            </div>
          </a>
        </div>
      </div>

      <div class="row g-3">
        <!-- Recent Budgets -->
        <div class="col-lg-8">
          <div class="card-custom">
            <div class="card-header-custom">
              <h2 class="section-title"><i class="bi bi-receipt-cutoff me-2"></i>Presupuestos Recientes</h2>
              <a routerLink="/budgets" class="btn btn-sm btn-secondary-custom" id="btn-view-all-budgets">Ver todos</a>
            </div>
            <div class="table-responsive">
              <table class="table table-modern" id="table-recent-budgets">
                <thead>
                  <tr>
                    <th>Nº Presupuesto</th>
                    <th>Título</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th class="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  @if (recentBudgets.length === 0) {
                    <tr>
                      <td colspan="5" class="text-center text-muted py-4">
                        <i class="bi bi-inbox" style="font-size: 1.5rem;"></i>
                        <div class="mt-1">No hay presupuestos aún</div>
                      </td>
                    </tr>
                  }
                  @for (budget of recentBudgets; track budget.id) {
                    <tr class="cursor-pointer" [routerLink]="['/budgets', budget.id]">
                      <td><span class="font-mono fw-semibold">{{ budget.budgetNumber }}</span></td>
                      <td>{{ budget.title }}</td>
                      <td>{{ budget.clientNameSnapshot || budget.client?.name || '—' }}</td>
                      <td>
                        <span class="badge-pill-custom"
                              [ngClass]="getStatusBadgeClass(budget.status)">
                          {{ getStatusLabel(budget.status) }}
                        </span>
                      </td>
                      <td class="text-end font-mono fw-semibold">{{ budget.total | number:'1.2-2' }} €</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Low Stock Alert -->
        <div class="col-lg-4">
          <div class="card-custom">
            <div class="card-header-custom">
              <h2 class="section-title"><i class="bi bi-exclamation-triangle me-2"></i>Alertas de Stock</h2>
            </div>
            <div class="stock-list">
              @if (lowStockItems.length === 0) {
                <div class="empty-state-sm">
                  <i class="bi bi-check-circle-fill text-success" style="font-size: 2rem;"></i>
                  <p class="text-muted mt-2 mb-0">Todo el stock en orden</p>
                </div>
              }
              @for (item of lowStockItems.slice(0, 8); track item.id) {
                <div class="stock-item">
                  <div class="stock-info">
                    <span class="stock-name">{{ item.name }}</span>
                    <span class="stock-ref text-muted">{{ item.reference }}</span>
                  </div>
                  <div class="stock-count">
                    <span class="badge-pill-custom badge-rejected">{{ item.stockQuantity }} uds</span>
                  </div>
                </div>
              }
              @if (lowStockItems.length > 8) {
                <div class="text-center py-2">
                  <a routerLink="/hardware" class="small text-primary">
                    Ver {{ lowStockItems.length - 8 }} más...
                  </a>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row g-3 mt-2">
        <div class="col-12">
          <div class="card-custom">
            <div class="card-header-custom">
              <h2 class="section-title"><i class="bi bi-lightning-fill me-2"></i>Acciones Rápidas</h2>
            </div>
            <div class="quick-actions">
              <a routerLink="/budgets" [queryParams]="{action: 'new'}" class="quick-action-btn" id="qa-new-budget">
                <div class="qa-icon" style="background: #e0f2fe; color: #0284c7;">
                  <i class="bi bi-plus-circle-fill"></i>
                </div>
                <span>Nuevo Presupuesto</span>
              </a>
              <a routerLink="/profiles/aluminium" class="quick-action-btn" id="qa-aluminium">
                <div class="qa-icon" style="background: #dbeafe; color: #2563eb;">
                  <i class="bi bi-layers-half"></i>
                </div>
                <span>Perfiles Aluminio</span>
              </a>
              <a routerLink="/profiles/iron" class="quick-action-btn" id="qa-iron">
                <div class="qa-icon" style="background: #fef3c7; color: #d97706;">
                  <i class="bi bi-hammer"></i>
                </div>
                <span>Perfiles Hierro</span>
              </a>
              <a routerLink="/clients" class="quick-action-btn" id="qa-clients">
                <div class="qa-icon" style="background: #d1fae5; color: #059669;">
                  <i class="bi bi-person-plus-fill"></i>
                </div>
                <span>Gestión Clientes</span>
              </a>
              <a routerLink="/calculator/structure" class="quick-action-btn" id="qa-calculator">
                <div class="qa-icon" style="background: #ede9fe; color: #7c3aed;">
                  <i class="bi bi-calculator-fill"></i>
                </div>
                <span>Calculadora</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 1.5rem; }

    .stat-value {
      font-size: 1.65rem;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.2;
    }
    .stat-label {
      font-size: 0.82rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .alert-stock {
      border: 1px solid #fecaca !important;
      background: #fff5f5 !important;
    }

    .card-header-custom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.15rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .section-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0;
    }

    .cursor-pointer { cursor: pointer; }
    .cursor-pointer:hover td { color: var(--color-primary) !important; }

    .stock-list { padding: 0.5rem 0; }
    .stock-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 1.15rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .stock-item:last-child { border-bottom: none; }
    .stock-info {
      display: flex;
      flex-direction: column;
    }
    .stock-name {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-main);
    }
    .stock-ref {
      font-size: 0.78rem;
    }
    .empty-state-sm {
      text-align: center;
      padding: 2rem 1rem;
    }

    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      padding: 1rem 1.15rem;
    }
    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.65rem 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      background: #fff;
      text-decoration: none;
      color: var(--text-main);
      font-size: 0.88rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .quick-action-btn:hover {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-sm);
      transform: translateY(-1px);
      color: var(--color-primary);
    }
    .qa-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = {
    budgets: 0,
    aluminiumProfiles: 0,
    ironProfiles: 0,
    hardware: 0,
    fillingMaterials: 0,
    clients: 0
  };

  recentBudgets: Budget[] = [];
  lowStockItems: HardwareAccessory[] = [];

  constructor(
    private budgetService: BudgetService,
    private aluminiumService: AluminiumProfileService,
    private ironService: IronProfileService,
    private hardwareService: HardwareAccessoryService,
    private fillingService: FillingMaterialService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      budgets: this.budgetService.getAll().pipe(catchError(() => of([]))),
      aluminium: this.aluminiumService.getAll().pipe(catchError(() => of([]))),
      iron: this.ironService.getAll().pipe(catchError(() => of([]))),
      hardware: this.hardwareService.getAll().pipe(catchError(() => of([]))),
      filling: this.fillingService.getAll().pipe(catchError(() => of([]))),
      clients: this.clientService.getAll().pipe(catchError(() => of([]))),
      lowStock: this.hardwareService.getLowStock().pipe(catchError(() => of([])))
    }).subscribe(data => {
      this.stats.budgets = data.budgets.length;
      this.stats.aluminiumProfiles = data.aluminium.length;
      this.stats.ironProfiles = data.iron.length;
      this.stats.hardware = data.hardware.length;
      this.stats.fillingMaterials = data.filling.length;
      this.stats.clients = data.clients.length;
      this.recentBudgets = data.budgets.slice(0, 5);
      this.lowStockItems = data.lowStock;
    });
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      'DRAFT': 'badge-draft',
      'PENDING_APPROVAL': 'badge-pending',
      'APPROVED': 'badge-approved',
      'INVOICED': 'badge-invoiced',
      'REJECTED': 'badge-rejected',
      'CANCELLED': 'badge-cancelled'
    };
    return map[status] || 'badge-draft';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'DRAFT': 'Borrador',
      'PENDING_APPROVAL': 'Pendiente',
      'APPROVED': 'Aprobado',
      'INVOICED': 'Facturado',
      'REJECTED': 'Rechazado',
      'CANCELLED': 'Cancelado'
    };
    return map[status] || status;
  }
}
