import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { RegisterComponent } from '../pages/auth/register/register.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RegisterComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  showRegisterForm = false;
  userCreatedMessage = '';

  constructor(private userService: UserService) {
    console.log('>>> AdminComponent: Constructor ejecutado');
  }

  ngOnInit(): void {
    console.log('>>> AdminComponent: ngOnInit ejecutado');
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('>>> AdminComponent: loadUsers llamado');
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('>>> Usuarios recibidos del backend:', users);
        this.users = users;
      },
      error: (err) => {
        console.error('>>> Error en la petición HTTP:', err);
      }
    });
  }

  updateUserRole(userId: number, newRole: string): void {
    this.userService.updateUserRole(userId, newRole as 'ADMIN' | 'EMPLOYEE').subscribe(() => {
      this.loadUsers();
    });
  }

  openRegisterForm(): void {
    this.userCreatedMessage = '';
    this.showRegisterForm = true;
  }

  onUserRegistered(): void {
    this.showRegisterForm = false;
    this.userCreatedMessage = 'Usuario creado correctamente.';
    this.loadUsers();
  }
}