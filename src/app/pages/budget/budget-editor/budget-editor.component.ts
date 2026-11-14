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
  templateUrl: './budget-editor.component.html',
  styleUrls: ['./budget-editor.component.css']
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
