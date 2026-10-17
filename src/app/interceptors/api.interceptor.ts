import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Clone request to set common headers if not uploading FormData
  let modifiedReq = req;
  if (!(req.body instanceof FormData)) {
    modifiedReq = req.clone({
      setHeaders: {
        'Accept': 'application/json'
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado en el servidor.';
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Error del cliente: ${error.error.message}`;
      } else {
        // Backend returned an unsuccessful response code
        errorMessage = `Error ${error.status}: ${error.error?.message || error.statusText || errorMessage}`;
      }
      console.error('[API Error Interceptor]:', errorMessage, error);
      return throwError(() => error);
    })
  );
};
