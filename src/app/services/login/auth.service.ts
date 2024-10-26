import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = ' ';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map((response) => {
          localStorage.setItem('auth_token', response.token);
          return true;
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(
            () => new Error('Error en login: ' + error.message)
          );
        })
      );
  }

  ogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('auth_token');
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
