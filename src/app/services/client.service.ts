import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class ClientService {

  private readonly url = `${API_CONFIG.baseUrl}/clients`;

  constructor(private http: HttpClient) {}

  getAll(search?: string): Observable<Client[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Client[]>(this.url, { params });
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.url}/${id}`);
  }

  getByTaxId(taxId: string): Observable<Client> {
    return this.http.get<Client>(`${this.url}/tax-id/${taxId}`);
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>(this.url, client);
  }

  update(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.url}/${id}`, client);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
