import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { Budget, BudgetItem } from '../../models/budget.model';

@Component({
  selector: 'app-resale-items',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="resale-items-page animate-fade-in">
      <!-- Title -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 class="h4 fw-bold text-dark mb-1">
            <i class="bi bi-cart-check text-primary me-2"></i>Artículos de Reventa y Distribución
          </h2>
          <p class="text-muted small mb-0">Entrada manual y cotización de elementos comerciales: Toldos y Mamparas de baño con cálculo de márgenes comerciales</p>
        </div>
      </div>

      <!-- Category Tabs -->
      <ul class="nav nav-tabs nav-fill mb-4 card-custom p-1 bg-white border">
        <li class="nav-item">
          <button class="nav-link py-3 fw-bold" [class.active]="activeCategory === 'AWNINGS'" (click)="activeCategory = 'AWNINGS'">
            <i class="bi bi-umbrella me-2"></i>Toldos y Protección Solar
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link py-3 fw-bold" [class.active]="activeCategory === 'SHOWER_SCREENS'" (click)="activeCategory = 'SHOWER_SCREENS'">
            <i class="bi bi-water me-2"></i>Mamparas de Baño y Ducha
          </button>
        </li>
      </ul>

      <!-- AWNINGS (TOLDOS) -->
      @if (activeCategory === 'AWNINGS') {
        <div class="row g-4 animate-fade-in">
          <div class="col-lg-7">
            <div class="card-custom p-4">
              <h5 class="fw-bold mb-3 text-primary border-bottom pb-2">
                <i class="bi bi-umbrella me-2"></i>Configurador de Toldo
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Tipo de Toldo</label>
                  <select class="form-select" [(ngModel)]="awning.type" (ngModelChange)="computeAwningPrice()">
                    <option value="BRAZO_INVISIBLE">Brazo Invisible Articulado</option>
                    <option value="COFRE_INTEGRAL">Cofre Integral Hermético</option>
                    <option value="PUNTO_RECTO">Punto Recto con Tensión</option>
                    <option value="PALILLERO">Pérgola Palillero Corredero</option>
                    <option value="VERTICAL_STOR">Vertical Cortavientos / Stor</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Accionamiento</label>
                  <select class="form-select" [(ngModel)]="awning.operation" (ngModelChange)="computeAwningPrice()">
                    <option value="MANUAL">Manual con Manivela</option>
                    <option value="MOTOR">Motorizado con Mando Vía Radio</option>
                    <option value="MOTOR_WIND_SENSOR">Motorizado + Sensor Viento/Sol (Anemómetro)</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Línea Frontal (Ancho en metros)</label>
                  <input type="number" class="form-control font-mono" [(ngModel)]="awning.widthMeters" (ngModelChange)="computeAwningPrice()" min="1.5" max="8.0" step="0.1">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Salida / Avance de Brazos (metros)</label>
                  <select class="form-select font-mono" [(ngModel)]="awning.projectionMeters" (ngModelChange)="computeAwningPrice()">
                    <option [ngValue]="1.5">1,50 m</option>
                    <option [ngValue]="2.0">2,00 m</option>
                    <option [ngValue]="2.5">2,50 m</option>
                    <option [ngValue]="3.0">3,00 m</option>
                    <option [ngValue]="3.5">3,50 m</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Tejido / Lona</label>
                  <select class="form-select" [(ngModel)]="awning.fabric">
                    <option value="ACRILICA_100">Lona Acrílica 100% Tintada en Masa</option>
                    <option value="MICROPERFORADA">Tejido Técnico Microperforado Soltis</option>
                    <option value="PVC_IMPERMEABLE">Lona PVC Impermeable y Reforzada</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Color de Lacado de Estructura</label>
                  <select class="form-select" [(ngModel)]="awning.structureColor">
                    <option value="BLANCO_9016">Blanco RAL 9016</option>
                    <option value="GRIS_7016">Antracita RAL 7016 Texturado</option>
                    <option value="PLATA">Plata Anodizado</option>
                    <option value="BRONCE">Bronce / Negro</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Coste Proveedor / Fabricante (€)</label>
                  <input type="number" class="form-control font-mono text-end" [(ngModel)]="awning.supplierCost" (ngModelChange)="computeAwningPrice()" min="0" step="10">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Margen Comercial (%)</label>
                  <input type="number" class="form-control font-mono text-end" [(ngModel)]="awning.marginPercent" (ngModelChange)="computeAwningPrice()" min="10" max="200" step="5">
                </div>
              </div>
            </div>
          </div>

          <!-- Awning Summary & Budget Add -->
          <div class="col-lg-5">
            <div class="card-custom p-4 bg-light">
              <h5 class="fw-bold mb-3 border-bottom pb-2">
                <i class="bi bi-cash-coin text-primary me-2"></i>Cotización de Toldo
              </h5>
              <div class="mb-3">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small">Superficie de Lona:</span>
                  <span class="font-mono">{{ (awning.widthMeters * awning.projectionMeters) | number:'1.2-2' }} m²</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small">Coste Base Proveedor:</span>
                  <span class="font-mono">{{ awning.supplierCost | number:'1.2-2' }} €</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small">Margen de Beneficio ({{ awning.marginPercent }}%):</span>
                  <span class="font-mono text-success">+ {{ (awning.supplierCost * (awning.marginPercent / 100)) | number:'1.2-2' }} €</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small">Plus Montaje e Instalación:</span>
                  <span class="font-mono">{{ awning.installationCost | number:'1.2-2' }} €</span>
                </div>
                <div class="border-top pt-3 mt-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="h6 fw-bold mb-0">Precio Venta (PVP):</span>
                    <span class="h4 fw-bold font-mono text-primary mb-0">{{ awningPvp | number:'1.2-2' }} €</span>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-top">
                <label class="form-label small fw-semibold">Añadir a Presupuesto:</label>
                <div class="input-group">
                  <select class="form-select form-select-sm" [(ngModel)]="targetBudgetId">
                    <option [ngValue]="null">-- Seleccionar Presupuesto --</option>
                    @for (b of budgets; track b.id) {
                      <option [ngValue]="b.id">{{ b.budgetNumber }} - {{ b.title }}</option>
                    }
                  </select>
                  <button class="btn btn-primary btn-sm" (click)="addAwningToBudget()" [disabled]="!targetBudgetId">
                    <i class="bi bi-plus-lg me-1"></i>Añadir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- SHOWER SCREENS (MAMPARAS) -->
      @if (activeCategory === 'SHOWER_SCREENS') {
        <div class="row g-4 animate-fade-in">
          <div class="col-lg-7">
            <div class="card-custom p-4">
              <h5 class="fw-bold mb-3 text-primary border-bottom pb-2">
                <i class="bi bi-water me-2"></i>Configurador de Mampara de Baño
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Modelo / Tipología</label>
                  <select class="form-select" [(ngModel)]="shower.type" (ngModelChange)="computeShowerPrice()">
                    <option value="FRONTAL_1F_1C">Frontal 1 Fijo + 1 Corredera</option>
                    <option value="FRONTAL_2F_2C">Frontal 2 Fijos + 2 Correderas</option>
                    <option value="ANGULAR_VERTICE">Angular al Vértice (2 Fijos + 2 Correderas)</option>
                    <option value="PANEL_FIJO_WALK_IN">Panel Fijo Walk-in Ducha Abierta</option>
                    <option value="ABATIBLE">Frontal Puerta Abatible / Pivotante</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Vidrio de Seguridad Templado</label>
                  <select class="form-select" [(ngModel)]="shower.glassThickness">
                    <option value="6MM_TRANSPARENTE">6 mm Transparente con Antical</option>
                    <option value="8MM_TRANSPARENTE">8 mm Transparente con Antical</option>
                    <option value="6MM_SATINADO">6 mm Satinado / Serigrafiado central</option>
                    <option value="8MM_FUME">8 mm Fumé / Gris Oscuro</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Ancho de Plato / Hueco (mm)</label>
                  <input type="number" class="form-control font-mono" [(ngModel)]="shower.widthMm" (ngModelChange)="computeShowerPrice()" min="600" max="2200" step="10">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Altura Estándar (mm)</label>
                  <select class="form-select font-mono" [(ngModel)]="shower.heightMm" (ngModelChange)="computeShowerPrice()">
                    <option [ngValue]="1950">1.950 mm (Estándar ducha)</option>
                    <option [ngValue]="2000">2.000 mm (Alta gama)</option>
                    <option [ngValue]="1500">1.500 mm (Para bañera)</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Color Perfilería y Tiradores</label>
                  <select class="form-select" [(ngModel)]="shower.profileFinish">
                    <option value="CROMO_BRILLO">Aluminio Cromo Brillo</option>
                    <option value="NEGRO_MATE">Negro Mate Industrial</option>
                    <option value="BLANCO">Lacado Blanco Mate</option>
                    <option value="ORO_CEPILLADO">Oro Cepillado / Brass</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Tratamiento Antical Incluido</label>
                  <select class="form-select" [(ngModel)]="shower.antiLimescale">
                    <option [ngValue]="true">Sí, tratamiento nanotecnológico antical</option>
                    <option [ngValue]="false">No, vidrio sin tratamiento</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Coste Proveedor / Fabricante (€)</label>
                  <input type="number" class="form-control font-mono text-end" [(ngModel)]="shower.supplierCost" (ngModelChange)="computeShowerPrice()" min="0" step="10">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Margen Comercial (%)</label>
                  <input type="number" class="form-control font-mono text-end" [(ngModel)]="shower.marginPercent" (ngModelChange)="computeShowerPrice()" min="10" max="200" step="5">
                </div>
              </div>
            </div>
          </div>

          <!-- Shower Summary & Budget Add -->
          <div class="col-lg-5">
            <div class="card-custom p-4 bg-light">
              <h5 class="fw-bold mb-3 border-bottom pb-2">
                <i class="bi bi-cash-coin text-primary me-2"></i>Cotización de Mampara
              </h5>
              <div class="mb-3">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small">Medidas:</span>
                  <span class="font-mono">{{ shower.widthMm }} x {{ shower.heightMm }} mm</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small">Coste Base Proveedor:</span>
                  <span class="font-mono">{{ shower.supplierCost | number:'1.2-2' }} €</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small">Margen de Beneficio ({{ shower.marginPercent }}%):</span>
                  <span class="font-mono text-success">+ {{ (shower.supplierCost * (shower.marginPercent / 100)) | number:'1.2-2' }} €</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small">Instalación y Sellado Silicona:</span>
                  <span class="font-mono">{{ shower.installationCost | number:'1.2-2' }} €</span>
                </div>
                <div class="border-top pt-3 mt-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="h6 fw-bold mb-0">Precio Venta (PVP):</span>
                    <span class="h4 fw-bold font-mono text-primary mb-0">{{ showerPvp | number:'1.2-2' }} €</span>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-top">
                <label class="form-label small fw-semibold">Añadir a Presupuesto:</label>
                <div class="input-group">
                  <select class="form-select form-select-sm" [(ngModel)]="targetBudgetId">
                    <option [ngValue]="null">-- Seleccionar Presupuesto --</option>
                    @for (b of budgets; track b.id) {
                      <option [ngValue]="b.id">{{ b.budgetNumber }} - {{ b.title }}</option>
                    }
                  </select>
                  <button class="btn btn-primary btn-sm" (click)="addShowerToBudget()" [disabled]="!targetBudgetId">
                    <i class="bi bi-plus-lg me-1"></i>Añadir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ResaleItemsComponent implements OnInit {
  activeCategory: 'AWNINGS' | 'SHOWER_SCREENS' = 'AWNINGS';
  budgets: Budget[] = [];
  targetBudgetId: number | null = null;

  awning = {
    type: 'BRAZO_INVISIBLE',
    operation: 'MANUAL',
    widthMeters: 4.0,
    projectionMeters: 2.5,
    fabric: 'ACRILICA_100',
    structureColor: 'BLANCO_9016',
    supplierCost: 450.00,
    marginPercent: 40,
    installationCost: 90.00
  };
  awningPvp = 720.00;

  shower = {
    type: 'FRONTAL_1F_1C',
    glassThickness: '6MM_TRANSPARENTE',
    widthMm: 1400,
    heightMm: 1950,
    profileFinish: 'CROMO_BRILLO',
    antiLimescale: true,
    supplierCost: 260.00,
    marginPercent: 45,
    installationCost: 65.00
  };
  showerPvp = 442.00;

  constructor(
    private budgetService: BudgetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.budgetService.getAll().subscribe({
      next: (b) => this.budgets = b,
      error: (err) => console.error('Error cargando presupuestos:', err)
    });
    this.computeAwningPrice();
    this.computeShowerPrice();
  }

  computeAwningPrice(): void {
    let baseCost = this.awning.widthMeters * this.awning.projectionMeters * 35;
    if (this.awning.type === 'COFRE_INTEGRAL') baseCost += 180;
    if (this.awning.operation === 'MOTOR') baseCost += 120;
    if (this.awning.operation === 'MOTOR_WIND_SENSOR') baseCost += 190;
    this.awning.supplierCost = Math.round(baseCost * 100) / 100;

    const marginAmount = this.awning.supplierCost * (this.awning.marginPercent / 100);
    this.awningPvp = Math.round((this.awning.supplierCost + marginAmount + this.awning.installationCost) * 100) / 100;
  }

  computeShowerPrice(): void {
    let baseCost = (this.shower.widthMm / 1000) * 140;
    if (this.shower.type === 'ANGULAR_VERTICE') baseCost += 60;
    if (this.shower.glassThickness.includes('8MM')) baseCost += 45;
    if (this.shower.profileFinish === 'NEGRO_MATE') baseCost += 30;
    this.shower.supplierCost = Math.round(baseCost * 100) / 100;

    const marginAmount = this.shower.supplierCost * (this.shower.marginPercent / 100);
    this.showerPvp = Math.round((this.shower.supplierCost + marginAmount + this.shower.installationCost) * 100) / 100;
  }

  addAwningToBudget(): void {
    if (!this.targetBudgetId) return;
    const item: BudgetItem = {
      budgetId: this.targetBudgetId,
      itemCategory: 'TOLDO',
      concept: `Toldo ${this.awning.type} ${this.awning.widthMeters}x${this.awning.projectionMeters}m (${this.awning.operation})`,
      quantity: 1,
      unit: 'ud',
      unitPrice: this.awningPvp,
      totalPrice: this.awningPvp,
      notes: `Tejido: ${this.awning.fabric}. Lacado estructura: ${this.awning.structureColor}. Incluye instalación.`
    };
    this.budgetService.addItem(this.targetBudgetId, item).subscribe({
      next: () => {
        alert('Toldo añadido al presupuesto con éxito.');
        this.router.navigate(['/budgets', this.targetBudgetId]);
      }
    });
  }

  addShowerToBudget(): void {
    if (!this.targetBudgetId) return;
    const item: BudgetItem = {
      budgetId: this.targetBudgetId,
      itemCategory: 'MAMPARA',
      concept: `Mampara de baño ${this.shower.type} (${this.shower.widthMm}x${this.shower.heightMm}mm) ${this.shower.profileFinish}`,
      quantity: 1,
      unit: 'ud',
      unitPrice: this.showerPvp,
      totalPrice: this.showerPvp,
      notes: `Vidrio: ${this.shower.glassThickness}. Tratamiento antical: ${this.shower.antiLimescale ? 'Sí' : 'No'}. Incluye montaje.`
    };
    this.budgetService.addItem(this.targetBudgetId, item).subscribe({
      next: () => {
        alert('Mampara añadida al presupuesto con éxito.');
        this.router.navigate(['/budgets', this.targetBudgetId]);
      }
    });
  }
}
