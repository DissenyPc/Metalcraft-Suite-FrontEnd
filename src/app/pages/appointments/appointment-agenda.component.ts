import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Appointment, AppointmentRequest, AppointmentStatus, AppointmentWorker } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';

type SortColumn =
  | 'id'
  | 'date'
  | 'time'
  | 'clientName'
  | 'clientPhone'
  | 'address'
  | 'workers'
  | 'observations'
  | 'status'
  | 'createdAt'
  | 'updatedAt';

@Component({
  selector: 'app-appointment-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-agenda.component.html',
  styleUrls: ['./appointment-agenda.component.css']
})
export class AppointmentAgendaComponent implements OnInit {
  appointments: Appointment[] = [];
  workers: AppointmentWorker[] = [];
  loading = true;
  loadError = false;
  workersLoading = true;
  workersLoadError = false;
  editorOpen = false;
  editingId: number | null = null;
  saving = false;
  saveError = '';

  searchTerm = '';
  sortColumn: SortColumn = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';
  readonly statuses: { value: AppointmentStatus; label: string }[] = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'realizada', label: 'Realizada' },
    { value: 'pospuesta', label: 'Pospuesta' },
    { value: 'atrasada', label: 'Atrasada' }
  ];
  form: AppointmentRequest = this.createEmptyForm();

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.getAll().subscribe({
      next: appointments => {
        this.appointments = appointments;
        this.loading = false;
      },
      error: error => {
        console.error('No se pudo cargar la agenda.', error);
        this.loadError = true;
        this.loading = false;
      }
    });
    this.appointmentService.getWorkers().subscribe({
      next: workers => {
        this.workers = workers;
        this.workersLoading = false;
      },
      error: error => {
        console.error('No se pudieron cargar los trabajadores de la agenda.', error);
        this.workersLoadError = true;
        this.workersLoading = false;
      }
    });
  }

  openCreateForm(): void {
    this.editingId = null;
    this.form = {
      ...this.createEmptyForm(),
      date: this.toLocalDateKey(new Date()),
      time: '09:00'
    };
    this.saveError = '';
    this.editorOpen = true;
  }

  openEditForm(appointment: Appointment): void {
    this.editingId = appointment.id;
    this.form = {
      date: appointment.date,
      time: appointment.time.slice(0, 5),
      address: appointment.address,
      clientName: appointment.clientName,
      clientPhone: appointment.clientPhone,
      observations: appointment.observations ?? '',
      status: appointment.status,
      workerIds: appointment.workers.map(worker => worker.id)
    };
    this.saveError = '';
    this.editorOpen = true;
  }

  closeForm(): void {
    if (this.saving) {
      return;
    }
    this.editorOpen = false;
    this.editingId = null;
    this.saveError = '';
  }

  saveAppointment(): void {
    if (this.saving) {
      return;
    }

    this.saving = true;
    this.saveError = '';
    const request: AppointmentRequest = {
      ...this.form,
      address: this.form.address.trim(),
      clientName: this.form.clientName.trim(),
      clientPhone: this.form.clientPhone.trim(),
      observations: this.form.observations.trim(),
      workerIds: [...this.form.workerIds]
    };
    const saveRequest = this.editingId === null
      ? this.appointmentService.create(request)
      : this.appointmentService.update(this.editingId, request);

    saveRequest.subscribe({
      next: savedAppointment => {
        if (this.editingId === null) {
          this.appointments = [...this.appointments, savedAppointment];
          this.searchTerm = '';
        } else {
          this.appointments = this.appointments.map(appointment =>
            appointment.id === savedAppointment.id ? savedAppointment : appointment
          );
        }
        this.saving = false;
        this.editorOpen = false;
        this.editingId = null;
      },
      error: error => {
        console.error('No se pudo guardar la tarea de la agenda.', error);
        this.saveError = 'No se pudo guardar la tarea. Revisa los datos e inténtalo de nuevo.';
        this.saving = false;
      }
    });
  }

  get visibleAppointments(): Appointment[] {
    const query = this.normalize(this.searchTerm);
    const filtered = query
      ? this.appointments.filter(appointment =>
          this.normalize(this.getSearchableValues(appointment).join(' ')).includes(query)
        )
      : [...this.appointments];

    return filtered.sort((first, second) => {
      const comparison = this.compare(
        this.getSortValue(first, this.sortColumn),
        this.getSortValue(second, this.sortColumn)
      );
      return (this.sortDirection === 'asc' ? comparison : -comparison)
        || this.compare(first.date, second.date)
        || this.compare(first.time, second.time);
    });
  }

  sortBy(column: SortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      return;
    }

    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  getSortIndicator(column: SortColumn): string {
    if (this.sortColumn !== column) {
      return '';
    }
    return this.sortDirection === 'asc' ? ' ↑' : ' ↓';
  }

  getStatusLabel(status: Appointment['status']): string {
    const labels: Record<Appointment['status'], string> = {
      pendiente: 'Pendiente',
      realizada: 'Realizada',
      pospuesta: 'Pospuesta',
      atrasada: 'Atrasada'
    };
    return labels[status];
  }

  private getSearchableValues(appointment: Appointment): string[] {
    return [
      String(appointment.id),
      appointment.date,
      this.formatDate(appointment.date),
      appointment.time,
      appointment.clientName,
      appointment.clientPhone,
      appointment.address,
      appointment.workers.map(worker => worker.username).join(' '),
      appointment.observations ?? '',
      appointment.status,
      this.getStatusLabel(appointment.status),
      appointment.createdAt,
      this.formatTimestamp(appointment.createdAt),
      appointment.updatedAt ?? '',
      appointment.updatedAt ? this.formatTimestamp(appointment.updatedAt) : ''
    ];
  }

  private getSortValue(appointment: Appointment, column: SortColumn): string | number {
    switch (column) {
      case 'id': return appointment.id;
      case 'date': return appointment.date;
      case 'time': return appointment.time;
      case 'clientName': return appointment.clientName;
      case 'clientPhone': return appointment.clientPhone;
      case 'address': return appointment.address;
      case 'workers': return appointment.workers.map(worker => worker.username).join(', ');
      case 'observations': return appointment.observations ?? '';
      case 'status': return this.getStatusLabel(appointment.status);
      case 'createdAt': return appointment.createdAt;
      case 'updatedAt': return appointment.updatedAt ?? '';
    }
  }

  private compare(first: string | number, second: string | number): number {
    if (typeof first === 'number' && typeof second === 'number') {
      return first - second;
    }
    return String(first).localeCompare(String(second), 'es', { numeric: true, sensitivity: 'base' });
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es')
      .trim();
  }

  private formatDate(value: string): string {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  private formatTimestamp(value: string): string {
    const [date, time = ''] = value.split('T');
    return `${this.formatDate(date)} ${time.slice(0, 5)}`;
  }

  private createEmptyForm(): AppointmentRequest {
    return {
      date: '',
      time: '',
      address: '',
      clientName: '',
      clientPhone: '',
      observations: '',
      status: 'pendiente',
      workerIds: []
    };
  }

  private toLocalDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
