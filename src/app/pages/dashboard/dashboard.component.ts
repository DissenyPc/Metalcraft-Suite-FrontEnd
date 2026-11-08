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
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
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