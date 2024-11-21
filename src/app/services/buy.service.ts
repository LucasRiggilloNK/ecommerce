import { Injectable, OnInit } from '@angular/core';
import { ProductInterface } from '../interfaces/product/product-interface';
import { CarritoService } from './cart.service';
import { RegisterService, User } from './register-service/register.service';
import { AuthService } from './login/auth.service';
import { DistanceMatrixService } from './distance/distance-matrix.service';
import { CardsService } from './cards.service';
import { Card } from '../interfaces/cards/card';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BuyService {
  private cartItems: ProductInterface[] = [];
  private user: User | null;
  subTotalPrice: number;

  constructor(
    private cartService: CarritoService,
    private authService: AuthService,
    private registerService: RegisterService,
    private distanceMatrixService: DistanceMatrixService,
    private cardsService: CardsService
  ) {
    this.user = null;
    this.subTotalPrice = 0;
  }

  public getCartItemsToBuy(): Observable<ProductInterface[]> {
    return this.cartService.getCartItems();
  }

  public getUser(userId: string) {
    return this.registerService.getUserById(userId);
  }

  getSubtotal() {
    this.subTotalPrice = this.cartService.getTotalPrice();
    return this.subTotalPrice;
  }

  getShippingPrice(destiny: string) {
    return this.distanceMatrixService.getApiDistanceMatrix(destiny);
  }

  async existsCard(card: Card): Promise<boolean> {
    let out:boolean = await this.cardsService.existsCard(card);
    return out;
  }
    
}
