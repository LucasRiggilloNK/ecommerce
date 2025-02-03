import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/login/auth.service';
import { CarritoService } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  name: string | null = null;
  stock: number = 0;
  totalQty: number = 0;
  adminId: string | null = 'd1ef';
  private stockSubscription: Subscription = new Subscription();
  private qtySubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.name = this.authService.getUserName();

    // Suscribirse a los cambios de cantidad y stock
    this.qtySubscription = this.carritoService
      .getTotalQuantity()
      .subscribe((qty) => {
        this.totalQty = qty;
      });

    this.stockSubscription = this.carritoService
      .getCartStock()
      .subscribe((stock) => {
        this.stock = stock;
      });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.name = null;
  }

  ngOnDestroy(): void {
    if (this.qtySubscription) {
      this.qtySubscription.unsubscribe();
    }
    if (this.stockSubscription) {
      this.stockSubscription.unsubscribe();
    }
    
  }

  getAdmin(): boolean {
    if (typeof window !== 'undefined') {
      const id = sessionStorage.getItem('userId');
      if (id === this.adminId) {
        return true;
      }
    }
    return false;
  }

  getUserName() {
    return this.authService.getUserName();
  }
  goToProfile() {
    this.router.navigate(['/profile']);
  }

}
