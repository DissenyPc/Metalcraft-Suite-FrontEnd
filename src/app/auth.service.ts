import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.loadUserRole();
  }

  private loadUserRole(): void {
    // Assuming you have an endpoint to fetch the user's role
    this.http.get<{ role: string }>('http://localhost:8080/api/user/role').subscribe(user => {
      this.userRole.next(user.role);
    });
  }

  hasRole(role: string): boolean {
    return this.userRole.value === role;
  }
}