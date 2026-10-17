import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  StructureCalculationRequest, StructureCalculationResult,
  ShutterCalculationRequest, ShutterCalculationResult,
  FixedModuleCalculationRequest, FixedModuleCalculationResult,
  GlazingCalculationRequest, GlazingCalculationResult,
  GrilleCalculationRequest, GrilleCalculationResult,
  RailingCalculationRequest, RailingCalculationResult,
  MosquitoNetCalculationRequest, MosquitoNetCalculationResult
} from '../models/calculator.model';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class CalculatorService {

  private readonly url = `${API_CONFIG.baseUrl}/calculator`;

  constructor(private http: HttpClient) {}

  calculateStructure(request: StructureCalculationRequest): Observable<StructureCalculationResult> {
    return this.http.post<StructureCalculationResult>(`${this.url}/structure`, request);
  }

  calculateShutter(request: ShutterCalculationRequest): Observable<ShutterCalculationResult> {
    return this.http.post<ShutterCalculationResult>(`${this.url}/shutter`, request);
  }

  calculateFixedModule(request: FixedModuleCalculationRequest): Observable<FixedModuleCalculationResult> {
    return this.http.post<FixedModuleCalculationResult>(`${this.url}/fixed-modules`, request);
  }

  calculateGlazing(request: GlazingCalculationRequest): Observable<GlazingCalculationResult> {
    return this.http.post<GlazingCalculationResult>(`${this.url}/glazing`, request);
  }

  calculateGrille(request: GrilleCalculationRequest): Observable<GrilleCalculationResult> {
    return this.http.post<GrilleCalculationResult>(`${this.url}/grille`, request);
  }

  calculateRailing(request: RailingCalculationRequest): Observable<RailingCalculationResult> {
    return this.http.post<RailingCalculationResult>(`${this.url}/railing`, request);
  }

  calculateMosquitoNet(request: MosquitoNetCalculationRequest): Observable<MosquitoNetCalculationResult> {
    return this.http.post<MosquitoNetCalculationResult>(`${this.url}/mosquito-net`, request);
  }
}
