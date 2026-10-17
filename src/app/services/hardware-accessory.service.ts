import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HardwareAccessory } from '../models/hardware-accessory.model';
import { BulkPriceUpdateRequest, BulkPriceUpdateResult, CsvImportResult } from '../models/bulk-price-update.model';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class HardwareAccessoryService {

  private readonly url = `${API_CONFIG.baseUrl}/hardware-accessories`;

  constructor(private http: HttpClient) {}

  getAll(category?: string, search?: string): Observable<HardwareAccessory[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (search) params = params.set('search', search);
    return this.http.get<HardwareAccessory[]>(this.url, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/categories`);
  }

  getLowStock(): Observable<HardwareAccessory[]> {
    return this.http.get<HardwareAccessory[]>(`${this.url}/low-stock`);
  }

  getById(id: number): Observable<HardwareAccessory> {
    return this.http.get<HardwareAccessory>(`${this.url}/${id}`);
  }

  create(accessory: HardwareAccessory): Observable<HardwareAccessory> {
    return this.http.post<HardwareAccessory>(this.url, accessory);
  }

  update(id: number, accessory: HardwareAccessory): Observable<HardwareAccessory> {
    return this.http.put<HardwareAccessory>(`${this.url}/${id}`, accessory);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  importCsv(file: File): Observable<CsvImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CsvImportResult>(`${this.url}/import-csv`, formData);
  }

  bulkPriceUpdate(request: BulkPriceUpdateRequest): Observable<BulkPriceUpdateResult> {
    return this.http.post<BulkPriceUpdateResult>(`${this.url}/bulk-price-update`, request);
  }
}
