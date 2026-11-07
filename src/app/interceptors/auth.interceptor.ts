import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;

/**
 * HTTP interceptor that attaches the JWT Bearer token to all outgoing requests
 * and handles 401 responses by automatically refreshing the token or logging the user out.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // 1. Adjuntar el Access Token si existe y no es una ruta de autenticación
  let authReq = req;
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 2. Manejar la respuesta y capturar errores 401 para renovar el token
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error es 401 y no estamos intentando loguearnos ni refrescar el token ya
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
        const refreshToken = authService.getRefreshToken();

        if (refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;

            // Llamamos al backend para obtener un nuevo Access Token usando el Refresh Token
            return authService.refreshToken({ refreshToken }).pipe(
              switchMap((res: any) => {
                isRefreshing = false;
                
                // Actualizamos el Access Token en el almacenamiento
                authService.updateAccessToken(res.token);

                // Reintentamos la petición original con el nuevo token actualizado
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.token}`
                  }
                });
                return next(retryReq);
              }),
              catchError((refreshError) => {
                isRefreshing = false;
                // Si el refresh token también ha expirado o es inválido, cerramos sesión
                authService.logout();
                return throwError(() => refreshError);
              })
            );
          }
        } else {
          // Si no hay refresh token disponible, cerramos sesión directamente
          authService.logout();
        }
      }

      return throwError(() => error);
    })
  );
};