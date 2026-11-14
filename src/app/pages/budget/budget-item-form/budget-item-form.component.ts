import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../services/budget.service';
import { CalculatorService } from '../../../services/calculator.service';
import { BudgetItem, Budget } from '../../../models/budget.model';
import {
  ShutterCalculationRequest,
  StructureCalculationResult,
  ShutterCalculationResult,
  FixedModuleCalculationResult,
  GlazingCalculationResult
} from '../../../models/calculator.model';

type ShutterWinderType = NonNullable<ShutterCalculationRequest['winderType']>;

@Component({
  selector: 'app-budget-item-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './budget-item-form.component.html',
  styleUrls: ['./budget-item-form.component.css']
})
export class BudgetItemFormComponent implements OnInit {
  budgetId!: number;
  budget: Budget | null = null;
  currentStep = 1;

  config = {
    elementTypology: 'WINDOW',
    openingSystem: 'PRACTICABLE',
    leavesCount: 2,
    series: 'EUROPEAN_40',
    finish: 'BLANCO_9016',
    glassType: 'CLIMALIT_4_16_4',
    openingWidthMm: 1200,
    openingHeightMm: 1200,
    quantity: 1,
    commercialBarLengthMm: 6000,
    solapePerSideMm: 20,
    fixingType: 'SCREW_ANCHOR',
    hasShutter: true,
    shutterBoxHeightMm: 155,
    shutterWinderType: 'BUILT_IN' as ShutterWinderType,
    shutterSlatType: 'ALUMINIO_TERMICO',
    shutterGuideType: 'GUIA_CON_FELPUDO',
    fixedDisposition: 'NONE',
    transomProfileType: 'T_TRANSOM',
    horizontalDivisions: 0,
    verticalDivisions: 0
  };

  calcResult: StructureCalculationResult | null = null;
  shutterResult: ShutterCalculationResult | null = null;
  fixedResult: FixedModuleCalculationResult | null = null;
  glazingResult: GlazingCalculationResult | null = null;

  calculating = false;
  adding = false;
  calculationErrors: string[] = [];

  priceBreakdown = {
    profiles: 95.00,
    glass: 65.00,
    shutter: 75.00,
    hardware: 38.00,
    labor: 50.00
  };

  unitPrice = 323.00;
  totalPrice = 323.00;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private budgetService: BudgetService,
    private calculatorService: CalculatorService
  ) {}

  ngOnInit(): void {
    const bId = this.route.snapshot.paramMap.get('id');
    if (bId) {
      this.budgetId = +bId;
      this.budgetService.getById(this.budgetId).subscribe({
        next: (b) => this.budget = b,
        error: (err) => console.error('Error cargando presupuesto:', err)
      });
    }
    this.recalculateLivePrice();
  }

  goToStep(step: number): void {
    this.currentStep = step;
    if (step === 6) {
      this.runCalculations();
    }
  }

  nextStep(): void {
    if (this.currentStep < 6) {
      this.currentStep++;
      if (this.currentStep === 6) {
        this.runCalculations();
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  runCalculations(): void {
    this.calculating = true;
    this.calculationErrors = [];
    this.calcResult = null;
    this.shutterResult = null;
    this.glazingResult = null;
    this.calculatorService.calculateStructure({
      openingWidthMm: this.config.openingWidthMm,
      openingHeightMm: this.config.openingHeightMm,
      solapePerSideMm: this.config.solapePerSideMm,
      profileMaterial: 'ALUMINIUM',
      commercialBarLengthMm: this.config.commercialBarLengthMm
    }).subscribe({
      next: (res) => {
        this.calcResult = res;
        this.recalculateLivePrice();
        this.calculating = false;
      },
      error: (err) => {
        console.error('Error calculando la estructura:', err);
        this.calculationErrors.push('No se pudo calcular la estructura. El precio mostrado es una estimación local.');
        this.recalculateLivePrice();
        this.calculating = false;
      }
    });

    if (this.config.hasShutter) {
      this.calculatorService.calculateShutter({
        openingWidthMm: this.config.openingWidthMm,
        openingHeightMm: this.config.openingHeightMm,
        boxHeightMm: this.config.shutterBoxHeightMm,
        winderType: this.config.shutterWinderType
      }).subscribe({
        next: (res) => this.shutterResult = res,
        error: (err) => {
          console.error('Error calculando la persiana:', err);
          this.calculationErrors.push('No se pudo calcular el desglose de la persiana.');
        }
      });
    }

    this.calculatorService.calculateGlazing({
      frameInnerWidthMm: this.config.openingWidthMm - (this.config.solapePerSideMm * 2) - 100,
      frameInnerHeightMm: (this.config.openingHeightMm - (this.config.hasShutter ? this.config.shutterBoxHeightMm : 0)) - 100,
      horizontalSplits: this.config.horizontalDivisions,
      verticalSplits: this.config.verticalDivisions
    }).subscribe({
      next: (res) => this.glazingResult = res,
      error: (err) => {
        console.error('Error calculando el acristalamiento:', err);
        this.calculationErrors.push('No se pudo calcular el desglose del acristalamiento.');
      }
    });
  }

  recalculateLivePrice(): void {
    // Computes realistic pricing from dimensions and selections
    const widthM = this.config.openingWidthMm / 1000;
    const heightM = this.config.openingHeightMm / 1000;
    const areaM2 = widthM * heightM;
    const perimeterM = (widthM + heightM) * 2;

    const profileRate = this.config.series.includes('RPT') ? 16.50 : 11.20;
    this.priceBreakdown.profiles = Math.round(perimeterM * profileRate * 1.6 * 100) / 100;

    const glassRate = this.config.glassType.includes('BAJO') ? 58.00 : (this.config.glassType.includes('LAMINAR') ? 65.00 : 42.00);
    this.priceBreakdown.glass = Math.round(areaM2 * glassRate * 100) / 100;

    if (this.config.hasShutter) {
      const shutterMotorCost = this.config.shutterWinderType === 'MOTORIZED' ? 85.00 : 35.00;
      this.priceBreakdown.shutter = Math.round((areaM2 * 55.00 + shutterMotorCost) * 100) / 100;
    } else {
      this.priceBreakdown.shutter = 0;
    }

    this.priceBreakdown.hardware = Math.round((28.00 + this.config.leavesCount * 12.00) * 100) / 100;
    this.priceBreakdown.labor = Math.round((45.00 + areaM2 * 15.00) * 100) / 100;

    this.unitPrice = Math.round((
      this.priceBreakdown.profiles +
      this.priceBreakdown.glass +
      this.priceBreakdown.shutter +
      this.priceBreakdown.hardware +
      this.priceBreakdown.labor
    ) * 100) / 100;

    this.totalPrice = Math.round(this.unitPrice * this.config.quantity * 100) / 100;
  }

  addPartidaToBudget(): void {
    this.adding = true;
    const concept = `Ventana ${this.config.openingSystem} ${this.config.leavesCount}H (${this.config.openingWidthMm}x${this.config.openingHeightMm}mm) ${this.config.series} ${this.config.finish}` +
      (this.config.hasShutter ? `, con persiana compacto ${this.config.shutterBoxHeightMm}mm` : '');

    const notes = `Solape: ${this.config.solapePerSideMm}mm. Vidrio: ${this.config.glassType}. Accionamiento persiana: ${this.config.shutterWinderType}.`;

    const newItem: BudgetItem = {
      budgetId: this.budgetId,
      itemCategory: 'ALUMINIO',
      concept: concept,
      quantity: this.config.quantity,
      unit: 'ud',
      unitPrice: this.unitPrice,
      discountPercentage: 0,
      totalPrice: this.totalPrice,
      notes: notes
    };

    this.budgetService.addItem(this.budgetId, newItem).subscribe({
      next: () => {
        this.adding = false;
        this.router.navigate(['/budgets', this.budgetId]);
      },
      error: (err) => {
        console.error('Error guardando partida:', err);
        this.adding = false;
        alert('Error al añadir la partida al presupuesto.');
      }
    });
  }
}
