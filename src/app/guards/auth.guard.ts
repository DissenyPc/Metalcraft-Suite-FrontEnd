import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard that prevents unauthenticated users from accessing protected routes.
 * Redirects to /login if not logged in.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('>>> authGuard evaluando. ¿Está logueado?', authService.isLoggedIn);

  if (authService.isLoggedIn) {
    return true;
  }

  console.warn('>>> authGuard: No autenticado, redirigiendo a /login');
  router.navigate(['/login']);
  return false;
};
