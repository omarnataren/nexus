import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  let authReq = req;
  
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/auth/refresh')) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

const handle401Error = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn, 
  authService: AuthService
): Observable<HttpEvent<unknown>> => {
  
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: any) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.access_token);

        return next(req.clone({
          setHeaders: { Authorization: `Bearer ${response.access_token}` }
        }));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(jwt => {
        return next(req.clone({
          setHeaders: { Authorization: `Bearer ${jwt}` }
        }));
      })
    );
  }
};