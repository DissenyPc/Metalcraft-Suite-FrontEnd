import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CalculatorService } from '../../services/calculator.service';
import { BudgetService } from '../../services/budget.service';
import { Budget, BudgetItem } from '../../models/budget.model';
import {
  GrilleCalculationRequest, GrilleCalculationResult,
  RailingCalculationRequest, RailingCalculationResult,
  MosquitoNetCalculationRequest, MosquitoNetCalculationResult
} from '../../models/calculator.model';

@Component({
  selector: 'app-special-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="special-products-page animate-fade-in">
      <!-- Page Title -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 class="h4 fw-bold text-dark mb-1">
            <i class="bi bi-grid-3x3 text-primary me-2"></i>Productos Especiales y Cerrajería
          </h2>
          <p class="text-muted small mb-0">Configuración técnica de Rejas, Barandillas y Mosquiteras con cálculo de despiece y herrajes de fijación</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <ul class="nav nav-tabs nav-fill mb-4 card-custom p-1 bg-white border">
        <li class="nav-item">
          <button class="nav-link py-3 fw-bold" [class.active]="activeTab === 'GRILLES'" (click)="setTab('GRILLES')">
            <i class="bi bi-grid-3x3 me-2"></i>1. Rejas de Seguridad (Hierro / Aluminio)
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link py-3 fw-bold" [class.active]="activeTab === 'RAILINGS'" (click)="setTab('RAILINGS')">
            <i class="bi bi-rulers me-2"></i>2. Barandillas y Pasamanos
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link py-3 fw-bold" [class.active]="activeTab === 'MOSQUITO_NETS'" (click)="setTab('MOSQUITO_NETS')">
            <i class="bi bi-bug me-2"></i>3. Mosquiteras (Correderas, Fijas, Enrollables)
          </button>
        </li>
      </ul>

      <!-- TAB 1: GRILLES (REJAS) -->
      @if (activeTab === 'GRILLES') {
        <div class="row g-4 animate-fade-in">
          <div class="col-lg-7">
            <div class="card-custom p-4">
              <h5 class="fw-bold mb-3 text-primary border-bottom pb-2">
                <i class="bi bi-shield-lock me-2"></i>Configuración de Reja
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Ancho de Hueco (mm)</label>
                  <input type="number" class="form-control font-mono" [(ngModel)]="grilleForm.openingWidthMm" (ngModelChange)="calcGrille()">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Alto de Hueco (mm)</label>
                  <input type="number" class="form-control font-mono" [(ngModel)]="grilleForm.openingHeightMm" (ngModelChange)="calcGrille()">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Material</label>
                  <select class="form-select" [(ngModel)]="grilleForm.material" (ngModelChange)="calcGrille()">
                    <option value="IRON">Hierro Macizo / Acero Forja</option>
                    <option value="ALUMINIUM">Aluminio Extrusión Tubular</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Tipo de Fijación</label>
                  <select class="form-select" [(ngModel)]="grilleForm.fixingType" (ngModelChange)="calcGrille()">
                    <option value="EMBEDDED">Embutida en Obra (+100mm por lado con garfas)</option>
                    <option value="SCREWED">Atornillada frontal con escuadras y taco metálico</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Separación Máx. entre Barrotes (mm)</label>
                  <input type="number" class="form-control font-mono" [(ngModel)]="grilleForm.maxSpacingMm" (ngModelChange)="calcGrille()" min="80" max="150">
                  <small class="text-muted">Normativa estándar: ≤ 130 mm</small>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Grosor de Barrote (mm)</label>
                  <select class="form-select font-mono" [(ngModel)]="grilleForm.barThicknessMm" (ngModelChange)="calcGrille()">
                    <option [ngValue]="14">14 mm</option>
                    <option [ngValue]="16">16 mm (estándar)</option>
                    <option [ngValue]="18">18 mm</option>
                    <option [ngValue]="20">20 mm macizo</option>
                  </select>
                </div>
                <div class="col-md-12">
                  <div class="form-check form-switch mt-2">
                    <input class="form-check-input" type="checkbox" id="crossbarsCheck" [(ngModel)]="grilleForm.hasCrossbars" (ngModelChange)="calcGrille()">
                    <label class="form-check-label fw-semibold" for="crossbarsCheck">
                      Incluir pasamanos o travesaño central horizontal de refuerzo
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Grille Results Box -->
          <div class="col-lg-5">
            <div class="card-custom p-4 bg-light">
              <h5 class="fw-bold mb-3 border-bottom pb-2">
                <i class="bi bi-calculator-fill text-primary me-2"></i>Despiece y Fijaciones
              </h5>
              @if (grilleResult) {
                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Número de Barrotes Verticales:</span>
                    <strong class="font-mono fs-6 text-primary">{{ grilleResult.barCount }} unidades</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Separación Libre entre Ejes:</span>
                    <span class="font-mono">{{ grilleResult.spacingBetweenBarsMm | number:'1.1-1' }} mm</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Longitud de Barrote Individual:</span>
                    <span class="font-mono">{{ grilleResult.barLengthMm }} mm</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Dimensión Marco Fabricación:</span>
                    <span class="font-mono">{{ grilleResult.frameWidthMm }} x {{ grilleResult.frameHeightMm }} mm</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Herrajes y Fijación Necesaria:</span>
                    <span class="badge bg-secondary">{{ grilleResult.fixingHardwareNeeded }}</span>
                  </div>
                  @if (grilleResult.totalWeightKg) {
                    <div class="d-flex justify-content-between mb-2">
                      <span class="text-muted small">Peso Estimado de Acero:</span>
                      <strong class="font-mono">{{ grilleResult.totalWeightKg | number:'1.1-1' }} kg</strong>
                    </div>
                  }
                  <div class="border-top pt-3 mt-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="h6 fw-bold mb-0">Precio Estimado PVP:</span>
                      <span class="h4 fw-bold font-mono text-primary mb-0">{{ estimatedGrillePrice | number:'1.2-2' }} €</span>
                    </div>
                  </div>
                </div>
              }
              <div class="mt-4 pt-3 border-top">
                <label class="form-label small fw-semibold">Añadir a Presupuesto:</label>
                <div class="input-group">
                  <select class="form-select form-select-sm" [(ngModel)]="targetBudgetId">
                    <option [ngValue]="null">-- Seleccionar Presupuesto --</option>
                    @for (b of budgets; track b.id) {
                      <option [ngValue]="b.id">{{ b.budgetNumber }} - {{ b.title }}</option>
                    }
                  </select>
                  <button class="btn btn-primary btn-sm" (click)="addGrilleToBudget()" [disabled]="!targetBudgetId">
                    <i class="bi bi-plus-lg me-1"></i>Añadir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 2: RAILINGS (BARANDILLAS) -->
      @if (activeTab === 'RAILINGS') {
        <div class="row g-4 animate-fade-in">
          <div class="col-lg-7">
            <div class="card-custom p-4">
              <h5 class="fw-bold mb-3 text-primary border-bottom pb-2">
                <i class="bi bi-rulers me-2"></i>Configuración de Barandilla
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Longitud Total de Tramo (mm)</label>
                  <input type="number" class="form-control font-mono" [(ngModel)]="railingForm.totalLengthMm" (ngModelChange)="calcRailing()" min="500" step="100">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Altura de Barandilla (mm)</label>
                  <select class="form-select font-mono" [(ngModel)]="railingForm.heightMm" (ngModelChange)="calcRailing()">
                    <option [ngValue]="900">900 mm (Escaleras interiores)</option>
                    <option [ngValue]="1000">1.000 mm (Balcones estándar CTE)</option>
                    <option [ngValue]="1100">1.100 mm (Balcones > 6m de altura CTE)</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Material</label>
                  <select class="form-select" [(ngModel)]="railingForm.material" (ngModelChange)="calcRailing()">
                    <option value="IRON">Hierro / Acero Lacado</option>
                    <option value="ALUMINIUM">Aluminio Anodizado Inox</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Tipo de Pasamanos</label>
                  <select class="form-select" [(ngModel)]="railingForm.handrailType" (ngModelChange)="calcRailing()">
                    <option value="ROUND">Tubo Redondo Ø 50 mm</option>
                    <option value="RECTANGULAR">Tubo Rectangular 60x20 mm / 50x30 mm</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Tipo de Relleno / Infill</label>
                  <select class="form-select" [(ngModel)]="railingForm.infillType" (ngModelChange)="calcRailing()">
                    <option value="VERTICAL_BARS">Barrotes verticales no escalables (≤100mm)</option>
                    <option value="HORIZONTAL_BARS">Varillas / tubos horizontales</option>
                    <option value="GLASS_PANELS">Vidrio laminar de seguridad 6+6 con pinzas</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Distancia Máx. entre Postes (mm)</label>
                  <input type="number" class="form-control font-mono" [(ngModel)]="railingForm.postMaxSpacingMm" (ngModelChange)="calcRailing()" min="800" max="1500" step="50">
                  <small class="text-muted">Recomendado: 1.000 mm</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Railing Results Box -->
          <div class="col-lg-5">
            <div class="card-custom p-4 bg-light">
              <h5 class="fw-bold mb-3 border-bottom pb-2">
                <i class="bi bi-calculator-fill text-primary me-2"></i>Despiece de Barandilla
              </h5>
              @if (railingResult) {
                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Postes Verticales (Pilares):</span>
                    <strong class="font-mono fs-6 text-primary">{{ railingResult.postCount }} unidades</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Placas Base de Anclaje a Suelo:</span>
                    <span class="font-mono">{{ railingResult.basePlatesCount }} placas</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Metros Lineales Pasamanos:</span>
                    <span class="font-mono">{{ railingResult.handrailLengthMeters | number:'1.2-2' }} m</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Relleno Configurado:</span>
                    <span class="small fw-semibold">{{ railingResult.infillSummary }}</span>
                  </div>
                  <div class="border-top pt-3 mt-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="h6 fw-bold mb-0">Precio Estimado PVP:</span>
                      <span class="h4 fw-bold font-mono text-primary mb-0">{{ estimatedRailingPrice | number:'1.2-2' }} €</span>
                    </div>
                  </div>
                </div>
              }
              <div class="mt-4 pt-3 border-top">
                <label class="form-label small fw-semibold">Añadir a Presupuesto:</label>
                <div class="input-group">
                  <select class="form-select form-select-sm" [(ngModel)]="targetBudgetId">
                    <option [ngValue]="null">-- Seleccionar Presupuesto --</option>
                    @for (b of budgets; track b.id) {
                      <option [ngValue]="b.id">{{ b.budgetNumber }} - {{ b.title }}</option>
                    }
                  </select>
                  <button class="btn btn-primary btn-sm" (click)="addRailingToBudget()" [disabled]="!targetBudgetId">
                    <i class="bi bi-plus-lg me-1"></i>Añadir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 3: MOSQUITO NETS (MOSQUITERAS) -->
      @if (activeTab === 'MOSQUITO_NETS') {
        <div class="row g-4 animate-fade-in">
          <div class="col-lg-7">
            <div class="card-custom p-4">
              <h5 class="fw-bold mb-3 text-primary border-bottom pb-2">
                <i class="bi bi-bug me-2"></i>Configuración de Mosquitera
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Tipo de Mosquitera</label>
                  <select class="form-select" [(ngModel)]="mosquitoForm.type" (ngModelChange)="calcMosquito()">
                    <option value="SLIDING">Corredera (Ruedas para carril ventana existente)</option>
                    <option value="ROLL_UP">Enrollable vertical (Cajetín y muelle)</option>
                    <option value="PLEATED">Plisada lateral (Para puertas y pasos continuos)</option>
                    <option value="FIXED">Fija con escuadras / clip imán</option>
                    <option value="PRACTICABLE">Abatible practicable con bisagras</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Número de Hojas (si corredera)</label>
                  <select class="form-select font-mono" [(ngModel)]="mosquitoForm.leafCount" (ngModelChange)="calcMosquito()">
                    <option [ngValue]="1">1 Hoja</option>
                    <option [ngValue]="2">2 Hojas</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Ancho Total de Ventana (mm)</label>
                  <input type="number" class="form-control font-mono" [(ngModel)]="mosquitoForm.windowWidthMm" (ngModelChange)="calcMosquito()" min="300" step="10">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Alto Total de Ventana (mm)</label>
                  <input type="number" class="form-control font-mono" [(ngModel)]="mosquitoForm.windowHeightMm" (ngModelChange)="calcMosquito()" min="300" step="10">
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Color de Perfilería</label>
                  <select class="form-select" [(ngModel)]="mosquitoColor">
                    <option value="BLANCO">Lacado Blanco RAL 9016</option>
                    <option value="PLATA">Plata Anodizado</option>
                    <option value="BRONCE">Bronce</option>
                    <option value="ANTRACITA">Antracita RAL 7016</option>
                    <option value="MADERA">Madera Embero</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-semibold">Malla Mosquitera</label>
                  <select class="form-select" [(ngModel)]="mosquitoMeshType">
                    <option value="FIBRA_VIDRIO">Fibra de vidrio gris ignífuga estándar</option>
                    <option value="ANTIPOLEN">Malla antipolen certificada</option>
                    <option value="METALICA">Malla metálica / pet screen (mascotas)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Mosquito Net Results Box -->
          <div class="col-lg-5">
            <div class="card-custom p-4 bg-light">
              <h5 class="fw-bold mb-3 border-bottom pb-2">
                <i class="bi bi-calculator-fill text-primary me-2"></i>Despiece y Malla
              </h5>
              @if (mosquitoResult) {
                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Dimensión Fabricación Hoja:</span>
                    <strong class="font-mono fs-6 text-primary">
                      {{ mosquitoResult.fabricationWidthMm }} x {{ mosquitoResult.fabricationHeightMm }} mm
                    </strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Superficie Tejido Malla:</span>
                    <span class="font-mono">{{ mosquitoResult.meshAreaM2 | number:'1.2-2' }} m²</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted small">Espesor de Guía Compatible:</span>
                    <span class="font-mono">{{ mosquitoResult.compatibleTrackWidthMm || 12 }} mm</span>
                  </div>
                  <div class="border-top pt-3 mt-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="h6 fw-bold mb-0">Precio Estimado PVP:</span>
                      <span class="h4 fw-bold font-mono text-primary mb-0">{{ estimatedMosquitoPrice | number:'1.2-2' }} €</span>
                    </div>
                  </div>
                </div>
              }
              <div class="mt-4 pt-3 border-top">
                <label class="form-label small fw-semibold">Añadir a Presupuesto:</label>
                <div class="input-group">
                  <select class="form-select form-select-sm" [(ngModel)]="targetBudgetId">
                    <option [ngValue]="null">-- Seleccionar Presupuesto --</option>
                    @for (b of budgets; track b.id) {
                      <option [ngValue]="b.id">{{ b.budgetNumber }} - {{ b.title }}</option>
                    }
                  </select>
                  <button class="btn btn-primary btn-sm" (click)="addMosquitoToBudget()" [disabled]="!targetBudgetId">
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
export class SpecialProductsComponent implements OnInit {
  activeTab: 'GRILLES' | 'RAILINGS' | 'MOSQUITO_NETS' = 'GRILLES';
  budgets: Budget[] = [];
  targetBudgetId: number | null = null;

  // Grille Form & Results
  grilleForm: GrilleCalculationRequest = {
    openingWidthMm: 1200,
    openingHeightMm: 1200,
    material: 'IRON',
    fixingType: 'EMBEDDED',
    maxSpacingMm: 130,
    barThicknessMm: 16,
    hasCrossbars: true
  };
  grilleResult: GrilleCalculationResult | null = null;
  estimatedGrillePrice = 185.00;

  // Railing Form & Results
  railingForm: RailingCalculationRequest = {
    totalLengthMm: 3000,
    heightMm: 1000,
    postMaxSpacingMm: 1000,
    material: 'IRON',
    handrailType: 'ROUND',
    infillType: 'VERTICAL_BARS'
  };
  railingResult: RailingCalculationResult | null = null;
  estimatedRailingPrice = 410.00;

  // Mosquito Net Form & Results
  mosquitoForm: MosquitoNetCalculationRequest = {
    windowWidthMm: 1200,
    windowHeightMm: 1200,
    leafCount: 1,
    type: 'SLIDING'
  };
  mosquitoColor = 'BLANCO';
  mosquitoMeshType = 'FIBRA_VIDRIO';
  mosquitoResult: MosquitoNetCalculationResult | null = null;
  estimatedMosquitoPrice = 52.00;

  constructor(
    private calculatorService: CalculatorService,
    private budgetService: BudgetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBudgets();
    this.calcGrille();
    this.calcRailing();
    this.calcMosquito();
  }

  setTab(tab: 'GRILLES' | 'RAILINGS' | 'MOSQUITO_NETS'): void {
    this.activeTab = tab;
  }

  loadBudgets(): void {
    this.budgetService.getAll().subscribe({
      next: (b) => this.budgets = b,
      error: (err) => console.error('Error cargando presupuestos:', err)
    });
  }

  calcGrille(): void {
    this.calculatorService.calculateGrille(this.grilleForm).subscribe({
      next: (res) => {
        this.grilleResult = res;
        const areaM2 = (this.grilleForm.openingWidthMm * this.grilleForm.openingHeightMm) / 1000000;
        const base = this.grilleForm.material === 'IRON' ? 120 : 155;
        this.estimatedGrillePrice = Math.round((areaM2 * base + (this.grilleForm.hasCrossbars ? 30 : 0)) * 100) / 100;
      },
      error: () => {}
    });
  }

  calcRailing(): void {
    this.calculatorService.calculateRailing(this.railingForm).subscribe({
      next: (res) => {
        this.railingResult = res;
        const meters = this.railingForm.totalLengthMm / 1000;
        const ratePerMeter = this.railingForm.infillType === 'GLASS_PANELS' ? 190 : 130;
        this.estimatedRailingPrice = Math.round(meters * ratePerMeter * 100) / 100;
      },
      error: () => {}
    });
  }

  calcMosquito(): void {
    this.calculatorService.calculateMosquitoNet(this.mosquitoForm).subscribe({
      next: (res) => {
        this.mosquitoResult = res;
        const areaM2 = (this.mosquitoForm.windowWidthMm * this.mosquitoForm.windowHeightMm) / 1000000;
        let baseRate = 38;
        if (this.mosquitoForm.type === 'ROLL_UP') baseRate = 48;
        if (this.mosquitoForm.type === 'PLEATED') baseRate = 95;
        this.estimatedMosquitoPrice = Math.round(Math.max(45, areaM2 * baseRate) * 100) / 100;
      },
      error: () => {}
    });
  }

  addGrilleToBudget(): void {
    if (!this.targetBudgetId || !this.grilleResult) return;
    const item: BudgetItem = {
      budgetId: this.targetBudgetId,
      itemCategory: 'REJA',
      concept: `Reja ${this.grilleForm.material === 'IRON' ? 'Hierro' : 'Aluminio'} (${this.grilleForm.openingWidthMm}x${this.grilleForm.openingHeightMm}mm) con ${this.grilleResult.barCount} barrotes`,
      quantity: 1,
      unit: 'ud',
      unitPrice: this.estimatedGrillePrice,
      totalPrice: this.estimatedGrillePrice,
      notes: `Fijación: ${this.grilleForm.fixingType}. Espaciado: ${this.grilleResult.spacingBetweenBarsMm}mm.`
    };
    this.budgetService.addItem(this.targetBudgetId, item).subscribe({
      next: () => {
        alert('Reja añadida al presupuesto con éxito.');
        this.router.navigate(['/budgets', this.targetBudgetId]);
      }
    });
  }

  addRailingToBudget(): void {
    if (!this.targetBudgetId || !this.railingResult) return;
    const item: BudgetItem = {
      budgetId: this.targetBudgetId,
      itemCategory: 'BARANDILLA',
      concept: `Barandilla ${this.railingForm.material} L=${this.railingForm.totalLengthMm}mm H=${this.railingForm.heightMm}mm (${this.railingResult.postCount} postes)`,
      quantity: 1,
      unit: 'ud',
      unitPrice: this.estimatedRailingPrice,
      totalPrice: this.estimatedRailingPrice,
      notes: `Pasamanos: ${this.railingForm.handrailType}. Relleno: ${this.railingForm.infillType}.`
    };
    this.budgetService.addItem(this.targetBudgetId, item).subscribe({
      next: () => {
        alert('Barandilla añadida al presupuesto con éxito.');
        this.router.navigate(['/budgets', this.targetBudgetId]);
      }
    });
  }

  addMosquitoToBudget(): void {
    if (!this.targetBudgetId || !this.mosquitoResult) return;
    const item: BudgetItem = {
      budgetId: this.targetBudgetId,
      itemCategory: 'MOSQUITERA',
      concept: `Mosquitera ${this.mosquitoForm.type} (${this.mosquitoForm.windowWidthMm}x${this.mosquitoForm.windowHeightMm}mm) color ${this.mosquitoColor}`,
      quantity: 1,
      unit: 'ud',
      unitPrice: this.estimatedMosquitoPrice,
      totalPrice: this.estimatedMosquitoPrice,
      notes: `Malla: ${this.mosquitoMeshType}. Fabricación: ${this.mosquitoResult.fabricationWidthMm}x${this.mosquitoResult.fabricationHeightMm}mm.`
    };
    this.budgetService.addItem(this.targetBudgetId, item).subscribe({
      next: () => {
        alert('Mosquitera añadida al presupuesto con éxito.');
        this.router.navigate(['/budgets', this.targetBudgetId]);
      }
    });
  }
}
