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
  templateUrl: './resale-items.component.html',
  styleUrls: ['./resale-items.component.css']
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
