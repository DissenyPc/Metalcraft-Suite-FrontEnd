/**
 * Represents the authenticated user in the application.
 */
export interface User {
  id: number;
  username: string; // <-- Cambiado de name? a username
  email: string;
  role: 'ADMIN' | 'EMPLOYEE'; // <-- Tipado estricto en lugar de un string genérico
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO sent to POST /api/auth/login
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * DTO sent to POST /api/auth/register
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * DTO received from login/register endpoints.
 */
/**export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}*/

export interface AuthResponse {
  token: string;
  refreshToken?: string; // Campos opcionales según el backend
  username: string;
  role: 'ADMIN' | 'EMPLOYEE'; 
}
