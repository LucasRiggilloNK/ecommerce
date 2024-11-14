import { Injectable, OnInit } from '@angular/core';
import { ProductInterface } from '../interfaces/product/product-interface';
import { CarritoService } from './cart.service';
import { RegisterService, User } from './register-service/register.service';
import { AuthService } from './login/auth.service';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class BuyService{

  private cartItems: ProductInterface[] = [];
  private user: User | null;
  subTotalPrice: number;

  constructor(private cartService: CarritoService, private authService: AuthService, private registerService: RegisterService){
    this.user = null;
    this.subTotalPrice = 0;
  }


  public getCartItemsToBuy(){
    this.cartItems = this.cartService.getCartItems();
    return this.cartItems;

  }

  public getUser(userId: string){
      return this.registerService.getUserById(userId);
  }

  getSubtotal(){
    this.subTotalPrice = this.cartService.getTotalPrice();
    return this.subTotalPrice;
  }
}
