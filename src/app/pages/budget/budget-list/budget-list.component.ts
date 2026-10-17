import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../services/budget.service';
import { ClientService } from '../../../services/client.service';
import { Budget, BudgetStatus, DuplicateBudgetRequest } from '../../../models/budget.model';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './budget-list.component.html',
  styles: [`
    .fs-xs { font-size: 0.75rem; }
    .badge-draft { background-color: #64748b; color: #fff; }
    .badge-pending { background-color: #f59e0b; color: #fff; }
    .badge-approved { background-color: #10b981; color: #fff; }
    .badge-invoiced { background-color: #0284c7; color: #fff; }
    .badge-rejected { background-color: #ef4444; color: #fff; }
    .badge-cancelled { background-color: #94a3b8; color: #fff; }
  `]
})
export class BudgetListComponent implements OnInit {
  budgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  clients: Client[] = [];
  loading = false;

  searchTerm = '';
  statusFilter = '';
  clientFilter: number | null = null;

  duplicatingBudget: Budget | null = null;
  duplicateData: DuplicateBudgetRequest = {};
  executingDuplicate = false;

  constructor(
    private budgetService: BudgetService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBudgets();
    this.loadClients();
  }

  loadBudgets(): void {
    this.loading = true;
    this.budgetService.getAll().subscribe({
      next: (data) => {
        this.budgets = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando presupuestos:', err);
        this.loading = false;
      }
    });
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (clients) => this.clients = clients,
      error: (err) => console.error('Error cargando clientes:', err)
    });
  }

  applyFilters(): void {
    let result = [...this.budgets];

    if (this.statusFilter) {
      result = result.filter(b => b.status === this.statusFilter);
    }

    if (this.clientFilter !== null) {
      result = result.filter(b => b.client?.id === this.clientFilter);
    }

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase().trim();
      result = result.filter(b => 
        (b.budgetNumber && b.budgetNumber.toLowerCase().includes(q)) ||
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.clientNameSnapshot && b.clientNameSnapshot.toLowerCase().includes(q)) ||
        (b.client?.name && b.client.name.toLowerCase().includes(q))
      );
    }

    this.filteredBudgets = result;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.clientFilter = null;
    this.applyFilters();
  }

  changeStatus(budget: Budget, newStatus: BudgetStatus): void {
    if (!budget.id) return;
    this.budgetService.updateStatus(budget.id, newStatus).subscribe({
      next: (updated) => {
        budget.status = updated.status;
        this.applyFilters();
      },
      error: (err) => console.error('Error cambiando estado:', err)
    });
  }

  openDuplicateModal(budget: Budget): void {
    this.duplicatingBudget = budget;
    this.duplicateData = {
      newBudgetNumber: `${budget.budgetNumber}-COPIA`,
      newTitle: `${budget.title} (Copia)`,
      validityDays: 30
    };
  }

  cancelDuplicate(): void {
    this.duplicatingBudget = null;
    this.duplicateData = {};
  }

  executeDuplicate(): void {
    if (!this.duplicatingBudget?.id) return;
    this.executingDuplicate = true;
    this.budgetService.duplicate(this.duplicatingBudget.id, this.duplicateData).subscribe({
      next: (newBudget) => {
        this.executingDuplicate = false;
        this.cancelDuplicate();
        this.router.navigate(['/budgets', newBudget.id]);
      },
      error: (err) => {
        console.error('Error al duplicar:', err);
        this.executingDuplicate = false;
      }
    });
  }

  confirmDelete(budget: Budget): void {
    if (!budget.id) return;
    if (confirm(`¿Está seguro de eliminar el presupuesto ${budget.budgetNumber}? Esta acción no se puede deshacer.`)) {
      this.budgetService.delete(budget.id).subscribe({
        next: () => {
          this.budgets = this.budgets.filter(b => b.id !== budget.id);
          this.applyFilters();
        },
        error: (err) => console.error('Error al eliminar presupuesto:', err)
      });
    }
  }

  getStatusBadgeClass(status: BudgetStatus): string {
    const map: Record<BudgetStatus, string> = {
      'DRAFT': 'badge-draft',
      'PENDING_APPROVAL': 'badge-pending',
      'APPROVED': 'badge-approved',
      'INVOICED': 'badge-invoiced',
      'REJECTED': 'badge-rejected',
      'CANCELLED': 'badge-cancelled'
    };
    return map[status] || 'badge-draft';
  }

  getStatusLabel(status: BudgetStatus): string {
    const map: Record<BudgetStatus, string> = {
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
