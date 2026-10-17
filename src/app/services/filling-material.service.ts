import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FillingMaterial } from '../models/filling-material.model';
import { BulkPriceUpdateRequest, BulkPriceUpdateResult, CsvImportResult } from '../models/bulk-price-update.model';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class FillingMaterialService {

  private readonly url = `${API_CONFIG.baseUrl}/filling-materials`;

  constructor(private http: HttpClient) {}

  getAll(materialType?: string, search?: string): Observable<FillingMaterial[]> {
    let params = new HttpParams();
    if (materialType) params = params.set('materialType', materialType);
    if (search) params = params.set('search', search);
    return this.http.get<FillingMaterial[]>(this.url, { params });
  }

  getTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/types`);
  }

  getById(id: number): Observable<FillingMaterial> {
    return this.http.get<FillingMaterial>(`${this.url}/${id}`);
  }

  create(material: FillingMaterial): Observable<FillingMaterial> {
    return this.http.post<FillingMaterial>(this.url, material);
  }

  update(id: number, material: FillingMaterial): Observable<FillingMaterial> {
    return this.http.put<FillingMaterial>(`${this.url}/${id}`, material);
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
