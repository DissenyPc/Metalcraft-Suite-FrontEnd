import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BatchAdjustRequest, BulkPriceUpdateResult } from '../models/bulk-price-update.model';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class PricingService {

  private readonly url = `${API_CONFIG.baseUrl}/pricing`;

  constructor(private http: HttpClient) {}

  batchAdjust(request: BatchAdjustRequest): Observable<BulkPriceUpdateResult> {
    return this.http.post<BulkPriceUpdateResult>(`${this.url}/batch-adjust`, request);
  }
}
