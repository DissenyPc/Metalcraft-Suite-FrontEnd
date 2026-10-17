import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  // Método auxiliar para adjuntar el token JWT en las cabeceras
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || ''; // Asegúrate de que 'token' coincide con la clave con la que guardas tu JWT al hacer login
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() });
  }

 updateUserRole(id: number, role: 'ADMIN' | 'EMPLOYEE'): Observable<{ message: string }> {
  return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/role`, { role });
}
}