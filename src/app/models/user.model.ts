/**
 * Represents the authenticated user in the application.
 */
export interface User {
  username: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
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
export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}
