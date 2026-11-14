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
  templateUrl: './special-products.component.html'
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
