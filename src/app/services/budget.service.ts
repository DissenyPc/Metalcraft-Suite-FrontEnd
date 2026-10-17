import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget, BudgetItem, BudgetStatus, DuplicateBudgetRequest } from '../models/budget.model';
import { Client } from '../models/client.model';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class BudgetService {

  private readonly baseUrl = `${API_CONFIG.baseUrl}/budgets`;
  private readonly clientsUrl = `${API_CONFIG.baseUrl}/clients`;

  constructor(private http: HttpClient) {}

  // ─── Budget CRUD ──────────────────────────────────────────────

  /**
   * Fetch all budgets with optional filters: status, client ID, search query.
   */
  getAll(status?: BudgetStatus, clientId?: number, search?: string): Observable<Budget[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (clientId) params = params.set('clientId', clientId.toString());
    if (search) params = params.set('search', search);
    return this.http.get<Budget[]>(this.baseUrl, { params });
  }

  // Alias for backward compatibility
  getAllBudgets(): Observable<Budget[]> {
    return this.getAll();
  }

  /**
   * Find budget by database primary key ID.
   */
  getById(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.baseUrl}/${id}`);
  }

  // Alias for backward compatibility
  getBudget(id: number): Observable<Budget> {
    return this.getById(id);
  }

  /**
   * Find budget by unique budget number (e.g. PRE-2026-001).
   */
  getByBudgetNumber(budgetNumber: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.baseUrl}/number/${budgetNumber}`);
  }

  /**
   * Fetch budgets belonging to a specific client ID.
   */
  getByClientId(clientId: number): Observable<Budget[]> {
    return this.getAll(undefined, clientId);
  }

  /**
   * Create a new budget with customer info snapshot and optional initial partidas.
   */
  create(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.baseUrl, budget);
  }

  createBudget(budget: Budget): Observable<Budget> {
    return this.create(budget);
  }

  /**
   * Update an existing budget and trigger recalculation of totals.
   */
  update(id: number, budget: Budget): Observable<Budget> {
    return this.http.put<Budget>(`${this.baseUrl}/${id}`, budget);
  }

  updateBudget(id: number, budget: Budget): Observable<Budget> {
    return this.update(id, budget);
  }

  /**
   * Update lifecycle status of a budget (DRAFT, PENDING_APPROVAL, APPROVED, INVOICED, REJECTED, CANCELLED).
   */
  updateStatus(id: number, status: BudgetStatus): Observable<Budget> {
    return this.http.patch<Budget>(`${this.baseUrl}/${id}/status`, null, {
      params: new HttpParams().set('status', status)
    });
  }

  /**
   * Delete a budget and cascade delete its partidas.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  deleteBudget(id: number): Observable<void> {
    return this.delete(id);
  }

  /**
   * Duplicate an existing budget with all its partidas,
   * with optional custom number, title, and target client.
   */
  duplicate(id: number, request?: DuplicateBudgetRequest): Observable<Budget> {
    return this.http.post<Budget>(`${this.baseUrl}/${id}/duplicate`, request || {});
  }

  duplicateBudget(id: number, request?: DuplicateBudgetRequest): Observable<Budget> {
    return this.duplicate(id, request);
  }

  // ─── Client Info Linking ──────────────────────────────────────

  /**
   * Fetch client info details for linking to budget snapshot.
   */
  getClientInfo(clientId: number): Observable<Client> {
    return this.http.get<Client>(`${this.clientsUrl}/${clientId}`);
  }

  /**
   * Search client database to link with budgets.
   */
  searchClients(searchQuery?: string): Observable<Client[]> {
    let params = new HttpParams();
    if (searchQuery) params = params.set('search', searchQuery);
    return this.http.get<Client[]>(this.clientsUrl, { params });
  }

  // ─── Budget Items (Partidas) CRUD ─────────────────────────────

  /**
   * Fetch list of items for a given budget.
   */
  getItems(budgetId: number): Observable<BudgetItem[]> {
    return this.http.get<BudgetItem[]>(`${this.baseUrl}/${budgetId}/items`);
  }

  /**
   * Fetch a specific item by its ID.
   */
  getItem(budgetId: number, itemId: number): Observable<BudgetItem> {
    return this.http.get<BudgetItem>(`${this.baseUrl}/${budgetId}/items/${itemId}`);
  }

  /**
   * Add a new calculated or manual item to the budget.
   */
  addItem(budgetId: number, item: BudgetItem): Observable<BudgetItem> {
    return this.http.post<BudgetItem>(`${this.baseUrl}/${budgetId}/items`, item);
  }

  /**
   * Update an existing item (quantity, price, discount, notes) in the budget.
   */
  updateItem(budgetId: number, itemId: number, item: BudgetItem): Observable<BudgetItem> {
    return this.http.put<BudgetItem>(`${this.baseUrl}/${budgetId}/items/${itemId}`, item);
  }

  /**
   * Remove an item from the budget.
   */
  removeItem(budgetId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${budgetId}/items/${itemId}`);
  }
}
