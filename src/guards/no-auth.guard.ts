import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../app/services/login/auth.service'; // Asegúrate de que el servicio AuthService esté correctamente importado

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
