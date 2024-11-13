import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  login(name: string, password: string): Observable<boolean> {
    return this.http
      .get<{ id: number; name: string; password: string }[]>(
        `${this.apiUrl}/users?username=${name}&password=${password}`
      )
      .pipe(
        map((users) => {
          if (users.length > 0) {
            if (typeof window !== 'undefined') {
              console.log('Usuario logueado:', users[0].name);
              localStorage.setItem('auth_token', 'your_token');
              localStorage.setItem('name', users[0].name);
            }
            return true;
          } else {
            return false;
          }
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(
            () => new Error('Error en login: ' + error.message)
          );
        })
      );
  }

  getUserName(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('name');
    }
    return null;
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    }
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  }
}
