import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../services/budget.service';
import { ClientService } from '../../../services/client.service';
import { Budget, BudgetItem, BudgetStatus } from '../../../models/budget.model';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-budget-editor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="budget-editor-page animate-fade-in">
      <!-- Breadcrumb & Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-1 small">
              <li class="breadcrumb-item"><a routerLink="/budgets" class="text-decoration-none">Presupuestos</a></li>
              <li class="breadcrumb-item active" aria-current="page">
                {{ isNew ? 'Nuevo Presupuesto' : budget.budgetNumber }}
              </li>
            </ol>
          </nav>
          <h2 class="h4 fw-bold text-dark mb-0">
            <i class="bi bi-receipt text-primary me-2"></i>
            {{ isNew ? 'Crear Nuevo Presupuesto' : 'Presupuesto ' + budget.budgetNumber }}
          </h2>
        </div>
        <div class="d-flex gap-2">
          <a routerLink="/budgets" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-1"></i>Volver
          </a>
          <button class="btn btn-primary" (click)="saveBudget()" [disabled]="saving">
            @if (saving) {
              <span class="spinner-border spinner-border-sm me-1"></span>Guardando...
            } @else {
              <i class="bi bi-check2-circle me-1"></i>Guardar Presupuesto
            }
          </button>
        </div>
      </div>

      <!-- Main Form Row -->
      <div class="row g-4 mb-4">
        <!-- General Info Card -->
        <div class="col-lg-8">
          <div class="card-custom p-4 mb-4">
            <h5 class="fw-bold mb-3 border-bottom pb-2">
              <i class="bi bi-info-circle text-primary me-2"></i>Información General
            </h5>
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label small fw-semibold">Nº Presupuesto *</label>
                <input type="text" class="form-control font-mono fw-bold" [(ngModel)]="budget.budgetNumber" placeholder="PRE-2026-001" required>
              </div>
              <div class="col-md-8">
                <label class="form-label small fw-semibold">Título del Proyecto *</label>
                <input type="text" class="form-control" [(ngModel)]="budget.title" placeholder="Ej. Cerramiento de terraza y ventanas climalit" required>
              </div>
              <div class="col-md-12">
                <label class="form-label small fw-semibold">Descripción / Alcance</label>
                <textarea class="form-control" rows="2" [(ngModel)]="budget.description" placeholder="Detalles generales de la obra o especificaciones del cliente..."></textarea>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-semibold">Fecha de Emisión</label>
                <input type="date" class="form-control" [(ngModel)]="budget.issueDate">
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-semibold">Válido Hasta</label>
                <input type="date" class="form-control" [(ngModel)]="budget.validUntil">
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-semibold">Estado</label>
                <select class="form-select" [(ngModel)]="budget.status">
                  <option value="DRAFT">Borrador</option>
                  <option value="PENDING_APPROVAL">Pendiente de Aprobación</option>
                  <option value="APPROVED">Aprobado</option>
                  <option value="INVOICED">Facturado</option>
                  <option value="REJECTED">Rechazado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Items (Partidas) Card -->
          <div class="card-custom p-4">
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2 flex-wrap gap-2">
              <h5 class="fw-bold mb-0">
                <i class="bi bi-list-task text-primary me-2"></i>Partidas del Presupuesto ({{ (budget.items || []).length }})
              </h5>
              <div class="d-flex gap-2 flex-wrap">
                <!-- Multi-step Window/Door Calculator Launch Button -->
                <button class="btn btn-sm btn-outline-primary fw-semibold" (click)="openInteractiveCalculator()" title="Configurador interactivo de ventanas y cerramientos">
                  <i class="bi bi-calculator me-1"></i>+ Partida Ventana / Puerta
                </button>
                <button class="btn btn-sm btn-outline-secondary" (click)="addManualItem()" title="Añadir línea manual">
                  <i class="bi bi-plus-lg me-1"></i>Partida Libre
                </button>
              </div>
            </div>

            <!-- Items Table -->
            @if (!budget.items || budget.items.length === 0) {
              <div class="text-center py-4 bg-light rounded-3 my-2 border border-dashed">
                <i class="bi bi-box-seam text-muted" style="font-size: 2rem;"></i>
                <p class="text-muted small mt-2 mb-2">No hay partidas añadidas en este presupuesto.</p>
                <button class="btn btn-sm btn-primary" (click)="openInteractiveCalculator()">
                  <i class="bi bi-magic me-1"></i>Abrir Calculador Interactivo de Partidas
                </button>
              </div>
            } @else {
              <div class="table-responsive">
                <table class="table table-sm align-middle">
                  <thead class="table-light fs-xs text-uppercase text-muted">
                    <tr>
                      <th style="width: 40px;">#</th>
                      <th style="width: 110px;">Categoría</th>
                      <th>Concepto / Detalle</th>
                      <th class="text-center" style="width: 75px;">Cant.</th>
                      <th class="text-center" style="width: 65px;">Ud.</th>
                      <th class="text-end" style="width: 100px;">Precio Ud.</th>
                      <th class="text-end" style="width: 80px;">Desc %</th>
                      <th class="text-end" style="width: 110px;">Total</th>
                      <th style="width: 40px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of budget.items; track $index) {
                      <tr>
                        <td class="text-muted small">{{ $index + 1 }}</td>
                        <td>
                          <select class="form-select form-select-sm fs-xs" [(ngModel)]="item.itemCategory">
                            <option value="ALUMINIO">Aluminio</option>
                            <option value="HIERRO">Hierro</option>
                            <option value="VIDRIO">Vidrio</option>
                            <option value="HERRAJE">Herraje</option>
                            <option value="PERSIANA">Persiana</option>
                            <option value="REJA">Reja</option>
                            <option value="BARANDILLA">Barandilla</option>
                            <option value="MOSQUITERA">Mosquitera</option>
                            <option value="TOLDO">Toldo</option>
                            <option value="MAMPARA">Mampara</option>
                            <option value="MANO_DE_OBRA">M. Obra</option>
                            <option value="MONTAJE">Montaje</option>
                            <option value="OTROS">Otros</option>
                          </select>
                        </td>
                        <td>
                          <input type="text" class="form-control form-control-sm" [(ngModel)]="item.concept" placeholder="Descripción de la partida">
                          @if (item.notes) {
                            <div class="fs-xs text-muted mt-1 fst-italic">{{ item.notes }}</div>
                          }
                        </td>
                        <td>
                          <input type="number" class="form-control form-control-sm text-center" [(ngModel)]="item.quantity" (ngModelChange)="recalculate()" min="1" step="1">
                        </td>
                        <td>
                          <input type="text" class="form-control form-control-sm text-center" [(ngModel)]="item.unit" placeholder="ud">
                        </td>
                        <td>
                          <input type="number" class="form-control form-control-sm text-end font-mono" [(ngModel)]="item.unitPrice" (ngModelChange)="recalculate()" min="0" step="0.01">
                        </td>
                        <td>
                          <input type="number" class="form-control form-control-sm text-end font-mono" [(ngModel)]="item.discountPercentage" (ngModelChange)="recalculate()" min="0" max="100" step="1">
                        </td>
                        <td class="text-end font-mono fw-bold text-dark">
                          {{ getItemTotal(item) | number:'1.2-2' }} €
                        </td>
                        <td class="text-center">
                          <button class="btn btn-link text-danger p-0" (click)="removeItem($index)" title="Eliminar partida">
                            <i class="bi bi-x-circle"></i>
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }

            <div class="mt-3">
              <label class="form-label small fw-semibold">Términos, Condiciones y Plazos de Entrega</label>
              <textarea class="form-control small" rows="2" [(ngModel)]="budget.termsAndConditions" placeholder="Ej. Validez de la oferta 30 días. Pago 40% al aceptar y 60% a la finalización. Plazo de fabricación 15 días hábiles."></textarea>
            </div>
          </div>
        </div>

        <!-- Right Side: Client Information & Totals Summary -->
        <div class="col-lg-4">
          <!-- Client Card -->
          <div class="card-custom p-4 mb-4">
            <h5 class="fw-bold mb-3 border-bottom pb-2">
              <i class="bi bi-person-badge text-primary me-2"></i>Cliente
            </h5>
            <div class="mb-3">
              <label class="form-label small fw-semibold">Seleccionar Cliente Existente</label>
              <select class="form-select" [(ngModel)]="selectedClientId" (ngModelChange)="onClientSelect($event)">
                <option [ngValue]="null">-- Seleccionar Cliente --</option>
                @for (c of clients; track c.id) {
                  <option [ngValue]="c.id">{{ c.name }} ({{ c.taxId }})</option>
                }
              </select>
            </div>

            <div class="bg-light p-3 rounded-2 border">
              <div class="mb-2">
                <label class="form-label fs-xs text-muted mb-0">Nombre / Razón Social</label>
                <input type="text" class="form-control form-control-sm bg-white" [(ngModel)]="budget.clientNameSnapshot" placeholder="Nombre completo">
              </div>
              <div class="row g-2 mb-2">
                <div class="col-6">
                  <label class="form-label fs-xs text-muted mb-0">NIF / CIF</label>
                  <input type="text" class="form-control form-control-sm bg-white font-mono" [(ngModel)]="budget.clientTaxIdSnapshot" placeholder="12345678Z">
                </div>
                <div class="col-6">
                  <label class="form-label fs-xs text-muted mb-0">Teléfono</label>
                  <input type="text" class="form-control form-control-sm bg-white" [(ngModel)]="budget.clientPhoneSnapshot" placeholder="600 000 000">
                </div>
              </div>
              <div class="mb-2">
                <label class="form-label fs-xs text-muted mb-0">Email</label>
                <input type="email" class="form-control form-control-sm bg-white" [(ngModel)]="budget.clientEmailSnapshot" placeholder="correo@ejemplo.com">
              </div>
              <div>
                <label class="form-label fs-xs text-muted mb-0">Dirección de Obra / Facturación</label>
                <input type="text" class="form-control form-control-sm bg-white" [(ngModel)]="budget.clientAddressSnapshot" placeholder="Calle, Nº, Ciudad, CP">
              </div>
            </div>
          </div>

          <!-- Totals Breakdown Card -->
          <div class="card-custom p-4">
            <h5 class="fw-bold mb-3 border-bottom pb-2">
              <i class="bi bi-calculator text-primary me-2"></i>Resumen Económico
            </h5>

            <div class="d-flex justify-content-between mb-2 small">
              <span class="text-muted">Subtotal Bruto:</span>
              <span class="font-mono fw-semibold">{{ (budget.subtotal || 0) | number:'1.2-2' }} €</span>
            </div>

            <div class="mb-2">
              <div class="d-flex justify-content-between align-items-center mb-1 small">
                <span class="text-muted">Descuento Global (%):</span>
                <div style="width: 90px;">
                  <input type="number" class="form-control form-control-sm text-end font-mono" [(ngModel)]="budget.globalDiscountPercentage" (ngModelChange)="recalculate()" min="0" max="100" step="1">
                </div>
              </div>
              @if ((budget.globalDiscountAmount || 0) > 0) {
                <div class="d-flex justify-content-between small text-danger">
                  <span>Importe Descuento:</span>
                  <span class="font-mono">- {{ (budget.globalDiscountAmount || 0) | number:'1.2-2' }} €</span>
                </div>
              }
            </div>

            <div class="d-flex justify-content-between mb-2 small border-top pt-2">
              <span class="text-muted">Base Imponible:</span>
              <span class="font-mono fw-semibold">
                {{ ((budget.subtotal || 0) - (budget.globalDiscountAmount || 0)) | number:'1.2-2' }} €
              </span>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-2 small">
              <span class="text-muted">IVA ({{ budget.taxRate || 21 }}%):</span>
              <span class="font-mono fw-semibold text-secondary">
                {{ (budget.taxAmount || 0) | number:'1.2-2' }} €
              </span>
            </div>

            <div class="border-top pt-3 mt-3">
              <div class="d-flex justify-content-between align-items-center">
                <span class="h5 fw-bold text-dark mb-0">TOTAL:</span>
                <span class="h4 fw-bold text-primary font-mono mb-0">
                  {{ (budget.total || 0) | number:'1.2-2' }} €
                </span>
              </div>
            </div>

            <div class="mt-4 d-grid gap-2">
              <button class="btn btn-primary btn-lg fw-bold" (click)="saveBudget()" [disabled]="saving">
                <i class="bi bi-floppy me-1"></i>Guardar Presupuesto
              </button>
              <button class="btn btn-outline-secondary" routerLink="/budgets">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fs-xs { font-size: 0.75rem; }
    .border-dashed { border-style: dashed !important; }
  `]
})
export class BudgetEditorComponent implements OnInit {
  budget: Budget = {
    budgetNumber: '',
    title: '',
    issueDate: new Date().toISOString().substring(0, 10),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    status: 'DRAFT',
    items: [],
    subtotal: 0,
    globalDiscountPercentage: 0,
    globalDiscountAmount: 0,
    taxRate: 21,
    taxAmount: 0,
    total: 0
  };

  clients: Client[] = [];
  selectedClientId: number | null = null;
  isNew = true;
  saving = false;

  constructor(
    private budgetService: BudgetService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isNew = false;
      this.loadBudget(+id);
    } else {
      this.isNew = true;
      this.generateBudgetNumber();
    }
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (clients) => this.clients = clients,
      error: (err) => console.error('Error cargando clientes:', err)
    });
  }

  loadBudget(id: number): void {
    this.budgetService.getById(id).subscribe({
      next: (data) => {
        this.budget = data;
        if (!this.budget.items) this.budget.items = [];
        if (data.client?.id) {
          this.selectedClientId = data.client.id;
        }
        this.recalculate();
      },
      error: (err) => console.error('Error cargando presupuesto:', err)
    });
  }

  generateBudgetNumber(): void {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.budget.budgetNumber = `PRE-${year}-${randomNum}`;
  }

  onClientSelect(clientId: number | null): void {
    if (!clientId) {
      this.budget.client = undefined;
      return;
    }
    const client = this.clients.find(c => c.id === clientId);
    if (client) {
      this.budget.client = client;
      this.budget.clientNameSnapshot = client.name;
      this.budget.clientTaxIdSnapshot = client.taxId;
      this.budget.clientPhoneSnapshot = client.phone;
      this.budget.clientEmailSnapshot = client.email;
      this.budget.clientAddressSnapshot = `${client.address || ''} ${client.city || ''}`.trim();
    }
  }

  addManualItem(): void {
    if (!this.budget.items) this.budget.items = [];
    const newItem: BudgetItem = {
      itemOrder: this.budget.items.length + 1,
      itemCategory: 'ALUMINIO',
      concept: 'Ventana practicable serie europea 2 hojas',
      quantity: 1,
      unit: 'ud',
      unitPrice: 250.00,
      discountPercentage: 0,
      totalPrice: 250.00
    };
    this.budget.items.push(newItem);
    this.recalculate();
  }

  removeItem(index: number): void {
    if (this.budget.items) {
      this.budget.items.splice(index, 1);
      this.recalculate();
    }
  }

  getItemTotal(item: BudgetItem): number {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const discount = Number(item.discountPercentage) || 0;
    const total = qty * price * (1 - discount / 100);
    item.totalPrice = Math.round(total * 100) / 100;
    return item.totalPrice;
  }

  recalculate(): void {
    let subtotal = 0;
    if (this.budget.items) {
      for (const item of this.budget.items) {
        subtotal += this.getItemTotal(item);
      }
    }
    this.budget.subtotal = Math.round(subtotal * 100) / 100;

    const discountPct = Number(this.budget.globalDiscountPercentage) || 0;
    const discountAmount = this.budget.subtotal * (discountPct / 100);
    this.budget.globalDiscountAmount = Math.round(discountAmount * 100) / 100;

    const taxableBase = this.budget.subtotal - this.budget.globalDiscountAmount;
    const taxRate = Number(this.budget.taxRate) || 21;
    const taxAmount = taxableBase * (taxRate / 100);
    this.budget.taxAmount = Math.round(taxAmount * 100) / 100;

    this.budget.total = Math.round((taxableBase + this.budget.taxAmount) * 100) / 100;
  }

  saveBudget(): void {
    if (!this.budget.title || !this.budget.budgetNumber) {
      alert('Por favor complete el número y título del presupuesto.');
      return;
    }
    this.recalculate();
    this.saving = true;

    if (this.isNew || !this.budget.id) {
      this.budgetService.create(this.budget).subscribe({
        next: (saved) => {
          this.saving = false;
          this.router.navigate(['/budgets', saved.id]);
        },
        error: (err) => {
          console.error('Error creando presupuesto:', err);
          this.saving = false;
          alert('Error al guardar el presupuesto.');
        }
      });
    } else {
      this.budgetService.update(this.budget.id, this.budget).subscribe({
        next: (updated) => {
          this.saving = false;
          this.budget = updated;
          alert('Presupuesto actualizado con éxito.');
        },
        error: (err) => {
          console.error('Error actualizando presupuesto:', err);
          this.saving = false;
          alert('Error al actualizar el presupuesto.');
        }
      });
    }
  }

  openInteractiveCalculator(): void {
    if (this.budget.id) {
      this.router.navigate(['/budgets', this.budget.id, 'calculator']);
    } else {
      // First save draft, then redirect to calculator
      this.recalculate();
      this.saving = true;
      this.budgetService.create(this.budget).subscribe({
        next: (saved) => {
          this.saving = false;
          this.router.navigate(['/budgets', saved.id, 'calculator']);
        },
        error: (err) => {
          console.error('Error guardando borrador previo a calculador:', err);
          this.saving = false;
          alert('Guarde el presupuesto antes de abrir el configurador interactivo.');
        }
      });
    }
  }
}
