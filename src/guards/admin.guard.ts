import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private adminID = 'd1ef';

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('userId');
      if (id === this.adminID) {
        console.log(id);
        return true;
      }
    }
    this.router.navigate(['/']);
    return false;
  }
}
