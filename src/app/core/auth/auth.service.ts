import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload, AuthResponse } from '@core/models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}auth`;

  private _currentUser = signal<JwtPayload | null>(null);
  private _isAuthenticated = signal<boolean>(false);

  public currentUser = this._currentUser.asReadonly();
  public isAuthenticated = this._isAuthenticated.asReadonly();

  constructor() {
    const token = this.getAccessToken();
    if (token) {
      this.decodeAndSetUser(token);
    }
  }

  login(credentials: any) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.saveTokens(res))
    );
  }



  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    }).pipe(
      tap(res => {
        // Al recibir el nuevo access_token, lo guardamos [cite: 87]
        localStorage.setItem('nexus_token', res.access_token);
        // Si el back devuelve un nuevo refresh token, lo actualizamos también (rotación)
        if (res.refresh_token) {
          localStorage.setItem('nexus_refresh_token', res.refresh_token);
        }
      }),
      catchError(err => {
        // Si el refresh falla (ej. refresh token expirado), adiós sesión
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout() {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_refresh_token');
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private saveTokens(res: AuthResponse) {
    localStorage.setItem('nexus_token', res.access_token);
    localStorage.setItem('nexus_refresh_token', res.refresh_token);
    // Aquí decodificarías el usuario como vimos antes
    this.decodeAndSetUser(res.access_token); 
  }

  getAccessToken() { return localStorage.getItem('nexus_token'); }
  getRefreshToken() { return localStorage.getItem('nexus_refresh_token'); }
  
  private decodeAndSetUser(token: string) { 
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      // 1. Chequeo de seguridad: ¿Expiró?
      if (decoded.exp && decoded.exp < currentTime) {
        console.warn('Token expirado al iniciar');
        this.logout();
        return;
      }

      // 2. Todo bien, actualizamos el estado
      this._currentUser.set(decoded);
      this._isAuthenticated.set(true);

    } catch (error) {
      // Token corrupto o manipulado
      console.error('Token inválido');
      this.logout();
    }
  }
}