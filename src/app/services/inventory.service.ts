import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AluminiumProfile } from '../models/aluminium-profile.model';
import { IronProfile } from '../models/iron-profile.model';
import { HardwareAccessory } from '../models/hardware-accessory.model';
import { FillingMaterial } from '../models/filling-material.model';
import {
  BulkPriceUpdateRequest,
  BulkPriceUpdateResult,
  BatchAdjustRequest,
  CsvImportResult
} from '../models/bulk-price-update.model';
import { API_CONFIG } from './api.config';

export type InventoryCatalogType = 'ALUMINIUM' | 'IRON' | 'HARDWARE' | 'FILLING' | 'ALL';

@Injectable({ providedIn: 'root' })
export class InventoryService {

  private readonly aluminiumUrl = `${API_CONFIG.baseUrl}/profiles/aluminium`;
  private readonly ironUrl = `${API_CONFIG.baseUrl}/profiles/iron`;
  private readonly hardwareUrl = `${API_CONFIG.baseUrl}/hardware-accessories`;
  private readonly fillingUrl = `${API_CONFIG.baseUrl}/filling-materials`;
  private readonly pricingUrl = `${API_CONFIG.baseUrl}/pricing`;
  private readonly importUrl = `${API_CONFIG.baseUrl}/import/csv`;

  constructor(private http: HttpClient) {}

  // ═════════════════════════════════════════════════════════════════
  // 1. ALUMINIUM PROFILES
  // ═════════════════════════════════════════════════════════════════

  getAluminiumProfiles(series?: string, search?: string): Observable<AluminiumProfile[]> {
    let params = new HttpParams();
    if (series) params = params.set('series', series);
    if (search) params = params.set('search', search);
    return this.http.get<AluminiumProfile[]>(this.aluminiumUrl, { params });
  }

  getAluminiumProfileById(id: number): Observable<AluminiumProfile> {
    return this.http.get<AluminiumProfile>(`${this.aluminiumUrl}/${id}`);
  }

  getAluminiumSeries(): Observable<string[]> {
    return this.http.get<string[]>(`${this.aluminiumUrl}/series`);
  }

  createAluminiumProfile(profile: AluminiumProfile): Observable<AluminiumProfile> {
    return this.http.post<AluminiumProfile>(this.aluminiumUrl, profile);
  }

  updateAluminiumProfile(id: number, profile: AluminiumProfile): Observable<AluminiumProfile> {
    return this.http.put<AluminiumProfile>(`${this.aluminiumUrl}/${id}`, profile);
  }

  deleteAluminiumProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.aluminiumUrl}/${id}`);
  }

  importAluminiumCsv(file: File): Observable<CsvImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CsvImportResult>(`${this.aluminiumUrl}/import-csv`, formData);
  }

  bulkUpdateAluminiumPrices(request: BulkPriceUpdateRequest): Observable<BulkPriceUpdateResult> {
    return this.http.post<BulkPriceUpdateResult>(`${this.aluminiumUrl}/bulk-price-update`, request);
  }

  // ═════════════════════════════════════════════════════════════════
  // 2. IRON PROFILES
  // ═════════════════════════════════════════════════════════════════

  getIronProfiles(series?: string, search?: string): Observable<IronProfile[]> {
    let params = new HttpParams();
    if (series) params = params.set('series', series);
    if (search) params = params.set('search', search);
    return this.http.get<IronProfile[]>(this.ironUrl, { params });
  }

  getIronProfileById(id: number): Observable<IronProfile> {
    return this.http.get<IronProfile>(`${this.ironUrl}/${id}`);
  }

  getIronSeries(): Observable<string[]> {
    return this.http.get<string[]>(`${this.ironUrl}/series`);
  }

  createIronProfile(profile: IronProfile): Observable<IronProfile> {
    return this.http.post<IronProfile>(this.ironUrl, profile);
  }

  updateIronProfile(id: number, profile: IronProfile): Observable<IronProfile> {
    return this.http.put<IronProfile>(`${this.ironUrl}/${id}`, profile);
  }

  deleteIronProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ironUrl}/${id}`);
  }

  importIronCsv(file: File): Observable<CsvImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CsvImportResult>(`${this.ironUrl}/import-csv`, formData);
  }

  bulkUpdateIronPrices(request: BulkPriceUpdateRequest): Observable<BulkPriceUpdateResult> {
    return this.http.post<BulkPriceUpdateResult>(`${this.ironUrl}/bulk-price-update`, request);
  }

  // ═════════════════════════════════════════════════════════════════
  // 3. HARDWARE & ACCESSORIES
  // ═════════════════════════════════════════════════════════════════

  getHardwareAccessories(category?: string, search?: string): Observable<HardwareAccessory[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (search) params = params.set('search', search);
    return this.http.get<HardwareAccessory[]>(this.hardwareUrl, { params });
  }

  getHardwareAccessoryById(id: number): Observable<HardwareAccessory> {
    return this.http.get<HardwareAccessory>(`${this.hardwareUrl}/${id}`);
  }

  getHardwareCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.hardwareUrl}/categories`);
  }

  getLowStockHardware(): Observable<HardwareAccessory[]> {
    return this.http.get<HardwareAccessory[]>(`${this.hardwareUrl}/low-stock`);
  }

  createHardwareAccessory(accessory: HardwareAccessory): Observable<HardwareAccessory> {
    return this.http.post<HardwareAccessory>(this.hardwareUrl, accessory);
  }

  updateHardwareAccessory(id: number, accessory: HardwareAccessory): Observable<HardwareAccessory> {
    return this.http.put<HardwareAccessory>(`${this.hardwareUrl}/${id}`, accessory);
  }

  deleteHardwareAccessory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.hardwareUrl}/${id}`);
  }

  importHardwareCsv(file: File): Observable<CsvImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CsvImportResult>(`${this.hardwareUrl}/import-csv`, formData);
  }

  bulkUpdateHardwarePrices(request: BulkPriceUpdateRequest): Observable<BulkPriceUpdateResult> {
    return this.http.post<BulkPriceUpdateResult>(`${this.hardwareUrl}/bulk-price-update`, request);
  }

  // ═════════════════════════════════════════════════════════════════
  // 4. FILLING MATERIALS (VIDRIOS Y PANELES)
  // ═════════════════════════════════════════════════════════════════

  getFillingMaterials(materialType?: string, search?: string): Observable<FillingMaterial[]> {
    let params = new HttpParams();
    if (materialType) params = params.set('materialType', materialType);
    if (search) params = params.set('search', search);
    return this.http.get<FillingMaterial[]>(this.fillingUrl, { params });
  }

  getFillingMaterialById(id: number): Observable<FillingMaterial> {
    return this.http.get<FillingMaterial>(`${this.fillingUrl}/${id}`);
  }

  getFillingTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.fillingUrl}/types`);
  }

  createFillingMaterial(material: FillingMaterial): Observable<FillingMaterial> {
    return this.http.post<FillingMaterial>(this.fillingUrl, material);
  }

  updateFillingMaterial(id: number, material: FillingMaterial): Observable<FillingMaterial> {
    return this.http.put<FillingMaterial>(`${this.fillingUrl}/${id}`, material);
  }

  deleteFillingMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.fillingUrl}/${id}`);
  }

  importFillingCsv(file: File): Observable<CsvImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CsvImportResult>(`${this.fillingUrl}/import-csv`, formData);
  }

  bulkUpdateFillingPrices(request: BulkPriceUpdateRequest): Observable<BulkPriceUpdateResult> {
    return this.http.post<BulkPriceUpdateResult>(`${this.fillingUrl}/bulk-price-update`, request);
  }

  // ═════════════════════════════════════════════════════════════════
  // 5. UNIFIED CSV IMPORTING & BULK PERCENTAGE PRICE UPDATES
  // ═════════════════════════════════════════════════════════════════

  /**
   * Universal CSV importer dispatching to the corresponding catalog endpoint.
   */
  importCsv(catalog: 'ALUMINIUM' | 'IRON' | 'HARDWARE' | 'FILLING', file: File): Observable<CsvImportResult> {
    switch (catalog) {
      case 'ALUMINIUM':
        return this.importAluminiumCsv(file);
      case 'IRON':
        return this.importIronCsv(file);
      case 'HARDWARE':
        return this.importHardwareCsv(file);
      case 'FILLING':
        return this.importFillingCsv(file);
    }
  }

  /**
   * Apply a percentage price update to a specific inventory catalog or series.
   * e.g. +5% or -3.5%
   */
  bulkPercentageUpdate(
    catalog: 'ALUMINIUM' | 'IRON' | 'HARDWARE' | 'FILLING',
    percentage: number,
    seriesOrCategory?: string
  ): Observable<BulkPriceUpdateResult> {
    const req: BulkPriceUpdateRequest = {
      percentageAdjustment: percentage,
      series: seriesOrCategory,
      category: seriesOrCategory,
      materialType: seriesOrCategory,
      updateMeterPrice: true,
      updateBarPrice: true
    };

    switch (catalog) {
      case 'ALUMINIUM':
        return this.bulkUpdateAluminiumPrices(req);
      case 'IRON':
        return this.bulkUpdateIronPrices(req);
      case 'HARDWARE':
        return this.bulkUpdateHardwarePrices(req);
      case 'FILLING':
        return this.bulkUpdateFillingPrices(req);
    }
  }

  /**
   * Unified batch price adjustment endpoint (/api/pricing/batch-adjust).
   */
  batchAdjust(request: BatchAdjustRequest): Observable<BulkPriceUpdateResult> {
    return this.http.post<BulkPriceUpdateResult>(`${this.pricingUrl}/batch-adjust`, request);
  }
}
