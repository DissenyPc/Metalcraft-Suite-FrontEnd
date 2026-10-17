import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard that restricts access to routes based on user roles.
 * Usage in routes: canActivate: [roleGuard], data: { roles: ['ADMIN'] }
 * Redirects to the dashboard if the user lacks the required role.
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (authService.hasRole(...requiredRoles)) {
    return true;
  }

  // User is logged in but doesn't have the required role
  router.navigate(['/']);
  return false;
};
