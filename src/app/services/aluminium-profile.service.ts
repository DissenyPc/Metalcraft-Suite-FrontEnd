import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AluminiumProfile } from '../models/aluminium-profile.model';
import { BulkPriceUpdateRequest, BulkPriceUpdateResult, CsvImportResult } from '../models/bulk-price-update.model';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class AluminiumProfileService {

  private readonly url = `${API_CONFIG.baseUrl}/profiles/aluminium`;

  constructor(private http: HttpClient) {}

  getAll(series?: string, search?: string): Observable<AluminiumProfile[]> {
    let params = new HttpParams();
    if (series) params = params.set('series', series);
    if (search) params = params.set('search', search);
    return this.http.get<AluminiumProfile[]>(this.url, { params });
  }

  getSeriesList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/series`);
  }

  getById(id: number): Observable<AluminiumProfile> {
    return this.http.get<AluminiumProfile>(`${this.url}/${id}`);
  }

  getByReference(ref: string): Observable<AluminiumProfile> {
    return this.http.get<AluminiumProfile>(`${this.url}/reference/${ref}`);
  }

  create(profile: AluminiumProfile): Observable<AluminiumProfile> {
    return this.http.post<AluminiumProfile>(this.url, profile);
  }

  update(id: number, profile: AluminiumProfile): Observable<AluminiumProfile> {
    return this.http.put<AluminiumProfile>(`${this.url}/${id}`, profile);
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
