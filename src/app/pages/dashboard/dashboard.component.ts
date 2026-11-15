import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of, catchError } from 'rxjs';
import { AluminiumProfileService } from '../../services/aluminium-profile.service';
import { IronProfileService } from '../../services/iron-profile.service';
import { HardwareAccessoryService } from '../../services/hardware-accessory.service';
import { FillingMaterialService } from '../../services/filling-material.service';
import { BudgetService } from '../../services/budget.service';
import { ClientService } from '../../services/client.service';
import { Budget } from '../../models/budget.model';
import { HardwareAccessory } from '../../models/hardware-accessory.model';
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';

type CalendarDayStatus = 'pending' | 'overdue' | 'completed';

interface CalendarDay {
  day: number | null;
  taskCount: number;
  status: CalendarDayStatus | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    budgets: 0,
    aluminiumProfiles: 0,
    ironProfiles: 0,
    hardware: 0,
    fillingMaterials: 0,
    clients: 0
  };

  recentBudgets: Budget[] = [];
  lowStockItems: HardwareAccessory[] = [];
  calendarDays: CalendarDay[] = [];
  monthTitle = '';
  agendaLoadError = false;

  constructor(
    private budgetService: BudgetService,
    private aluminiumService: AluminiumProfileService,
    private ironService: IronProfileService,
    private hardwareService: HardwareAccessoryService,
    private fillingService: FillingMaterialService,
    private clientService: ClientService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      budgets: this.budgetService.getAll().pipe(catchError(() => of([]))),
      aluminium: this.aluminiumService.getAll().pipe(catchError(() => of([]))),
      iron: this.ironService.getAll().pipe(catchError(() => of([]))),
      hardware: this.hardwareService.getAll().pipe(catchError(() => of([]))),
      filling: this.fillingService.getAll().pipe(catchError(() => of([]))),
      clients: this.clientService.getAll().pipe(catchError(() => of([]))),
      lowStock: this.hardwareService.getLowStock().pipe(catchError(() => of([]))),
      appointments: this.appointmentService.getAll().pipe(catchError(error => {
        this.agendaLoadError = true;
        console.error('No se pudieron cargar las citas de la agenda.', error);
        return of([]);
      }))
    }).subscribe(data => {
      this.stats.budgets = data.budgets.length;
      this.stats.aluminiumProfiles = data.aluminium.length;
      this.stats.ironProfiles = data.iron.length;
      this.stats.hardware = data.hardware.length;
      this.stats.fillingMaterials = data.filling.length;
      this.stats.clients = data.clients.length;
      this.recentBudgets = data.budgets.slice(0, 5);
      this.lowStockItems = data.lowStock;
      this.buildCalendar(data.appointments);
    });
  }

  private buildCalendar(appointments: Appointment[]): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    this.monthTitle = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    const appointmentsByDate = new Map<string, Appointment[]>();
    for (const appointment of appointments) {
      const [appointmentYear, appointmentMonth] = appointment.date.split('-').map(Number);
      if (appointmentYear !== year || appointmentMonth !== month + 1) {
        continue;
      }

      const dayAppointments = appointmentsByDate.get(appointment.date) ?? [];
      dayAppointments.push(appointment);
      appointmentsByDate.set(appointment.date, dayAppointments);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    const todayKey = this.toDateKey(now);

    this.calendarDays = Array.from({ length: totalCells }, (_, index) => {
      const day = index - firstWeekday + 1;
      if (day < 1 || day > daysInMonth) {
        return { day: null, taskCount: 0, status: null };
      }

      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAppointments = appointmentsByDate.get(dateKey) ?? [];
      return {
        day,
        taskCount: dayAppointments.length,
        status: this.getDayStatus(dayAppointments, dateKey, todayKey)
      };
    });
  }

  private getDayStatus(
    appointments: Appointment[],
    dateKey: string,
    todayKey: string
  ): CalendarDayStatus | null {
    if (appointments.some(appointment =>
      appointment.status === 'atrasada' ||
      (dateKey < todayKey && appointment.status !== 'realizada')
    )) {
      return 'overdue';
    }

    if (appointments.some(appointment =>
      appointment.status === 'pendiente' || appointment.status === 'pospuesta'
    )) {
      return 'pending';
    }

    return appointments.length > 0 && appointments.every(appointment => appointment.status === 'realizada')
      ? 'completed'
      : null;
  }

  private toDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  getCalendarStatusLabel(status: CalendarDayStatus): string {
    const labels: Record<CalendarDayStatus, string> = {
      pending: 'pendiente',
      overdue: 'atrasada',
      completed: 'realizada'
    };
    return labels[status];
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      'DRAFT': 'badge-draft',
      'PENDING_APPROVAL': 'badge-pending',
      'APPROVED': 'badge-approved',
      'INVOICED': 'badge-invoiced',
      'REJECTED': 'badge-rejected',
      'CANCELLED': 'badge-cancelled'
    };
    return map[status] || 'badge-draft';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'DRAFT': 'Borrador',
      'PENDING_APPROVAL': 'Pendiente',
      'APPROVED': 'Aprobado',
      'INVOICED': 'Facturado',
      'REJECTED': 'Rechazado',
      'CANCELLED': 'Cancelado'
    };
    return map[status] || status;
  }
}