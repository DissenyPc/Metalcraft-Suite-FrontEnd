import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
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
