import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="clients-page animate-fade-in">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 class="h4 fw-bold text-dark mb-1">
            <i class="bi bi-people-fill text-primary me-2"></i>Gestión de Clientes
          </h2>
          <p class="text-muted small mb-0">Directorio de clientes, datos de facturación y direcciones de obra</p>
        </div>
        <div>
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="bi bi-person-plus-fill me-1"></i>Nuevo Cliente
          </button>
        </div>
      </div>

      <div class="card-custom p-3 mb-4">
        <div class="input-group">
          <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
          <input type="text" class="form-control border-start-0" placeholder="Buscar por nombre, CIF/NIF, teléfono o email..." [(ngModel)]="searchTerm" (input)="filterClients()">
        </div>
      </div>

      <div class="card-custom overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light fs-xs text-uppercase text-muted">
              <tr>
                <th>Nombre / Razón Social</th>
                <th>NIF / CIF</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Población</th>
                <th class="text-center" style="width: 120px;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (c of filteredClients; track c.id) {
                <tr>
                  <td class="fw-semibold text-dark">{{ c.name }}</td>
                  <td class="font-mono text-muted">{{ c.taxId || '—' }}</td>
                  <td>{{ c.phone || '—' }}</td>
                  <td>{{ c.email || '—' }}</td>
                  <td>{{ c.city || '—' }}</td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary p-1 px-2 me-1" (click)="editClient(c)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger p-1 px-2" (click)="deleteClient(c)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Client Modal -->
      @if (showModal) {
        <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg border-0">
              <div class="modal-header bg-light">
                <h5 class="modal-title fw-bold">
                  {{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}
                </h5>
                <button type="button" class="btn-close" (click)="showModal = false"></button>
              </div>
              <div class="modal-body p-4">
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Nombre o Razón Social *</label>
                  <input type="text" class="form-control" [(ngModel)]="currentClient.name" required>
                </div>
                <div class="row g-2 mb-3">
                  <div class="col-6">
                    <label class="form-label small fw-semibold">NIF / CIF *</label>
                    <input type="text" class="form-control font-mono" [(ngModel)]="currentClient.taxId" required>
                  </div>
                  <div class="col-6">
                    <label class="form-label small fw-semibold">Teléfono</label>
                    <input type="text" class="form-control" [(ngModel)]="currentClient.phone">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Correo Electrónico</label>
                  <input type="email" class="form-control" [(ngModel)]="currentClient.email">
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Dirección</label>
                  <input type="text" class="form-control" [(ngModel)]="currentClient.address">
                </div>
                <div class="row g-2">
                  <div class="col-6">
                    <label class="form-label small fw-semibold">Población</label>
                    <input type="text" class="form-control" [(ngModel)]="currentClient.city">
                  </div>
                  <div class="col-6">
                    <label class="form-label small fw-semibold">Código Postal</label>
                    <input type="text" class="form-control font-mono" [(ngModel)]="currentClient.postalCode">
                  </div>
                </div>
              </div>
              <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary btn-sm" (click)="showModal = false">Cancelar</button>
                <button type="button" class="btn btn-primary btn-sm" (click)="saveClient()">
                  <i class="bi bi-check-lg me-1"></i>Guardar Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .fs-xs { font-size: 0.75rem; }
  `]
})
export class ClientManagementComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';
  showModal = false;
  isEdit = false;

  currentClient: Client = {
    name: '',
    taxId: ''
  };

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAll().subscribe(data => {
      this.clients = data;
      this.filterClients();
    });
  }

  filterClients(): void {
    const q = this.searchTerm.toLowerCase().trim();
    this.filteredClients = this.clients.filter(c =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      (c.taxId && c.taxId.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  }

  openCreateModal(): void {
    this.isEdit = false;
    this.currentClient = { name: '', taxId: '' };
    this.showModal = true;
  }

  editClient(client: Client): void {
    this.isEdit = true;
    this.currentClient = { ...client };
    this.showModal = true;
  }

  saveClient(): void {
    if (!this.currentClient.name || !this.currentClient.taxId) {
      alert('Nombre y NIF/CIF son obligatorios.');
      return;
    }

    if (this.isEdit && this.currentClient.id) {
      this.clientService.update(this.currentClient.id, this.currentClient).subscribe(() => {
        this.showModal = false;
        this.loadClients();
      });
    } else {
      this.clientService.create(this.currentClient).subscribe(() => {
        this.showModal = false;
        this.loadClients();
      });
    }
  }

  deleteClient(client: Client): void {
    if (!client.id) return;
    if (confirm(`¿Eliminar cliente ${client.name}?`)) {
      this.clientService.delete(client.id).subscribe(() => {
        this.loadClients();
      });
    }
  }
}
