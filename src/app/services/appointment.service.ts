import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, AppointmentRequest, AppointmentWorker } from '../models/appointment.model';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly url = `${API_CONFIG.baseUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.url);
  }

  getWorkers(): Observable<AppointmentWorker[]> {
    return this.http.get<AppointmentWorker[]>(`${this.url}/workers`);
  }

  create(request: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.url, request);
  }

  update(id: number, request: AppointmentRequest): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.url}/${id}`, request);
  }
}
