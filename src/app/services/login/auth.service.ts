import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .get<{ id: number; email: string; password: string; name: string }[]>(
        `${this.apiUrl}/users?email=${email}&password=${password}`
      )
      .pipe(
        map((users) => {
          const user = users.find(
            (u) => u.email === email && u.password === password
          );
  
          if (user) {
            if (typeof window !== 'undefined') {
              console.log('Usuario logueado:', user.email);
              localStorage.setItem('auth_token', 'your_token');
              localStorage.setItem('email', user.email);
              localStorage.setItem('userId', String(user.id));
              localStorage.setItem('name', user.name); 
            }
            window.location.reload();
            return true;
          }
          return false;
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

  getUserId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId');
    }
    return null;
  }

  logout(): void {
    if (confirm('Estas seguro que queres cerrar sesión?')) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.reload();
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
