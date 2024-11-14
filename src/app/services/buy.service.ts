import { Injectable, OnInit } from '@angular/core';
import { ProductInterface } from '../interfaces/product/product-interface';
import { CarritoService } from './cart.service';
import { User } from './register-service/register.service';
import { AuthService } from './login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BuyService{

  private cartItems: ProductInterface[] = [];
  private user: User | null;
  

  constructor(private cartService: CarritoService, private authService: AuthService){
    this.user = null;
  }


  public getCartItemsToBuy(){
    this.cartItems = this.cartService.getCartItems();
    return this.cartItems;

  }

  public getUser(){
    let userId = this.authService.getUserId();
    
  }

  getSubtotal(){

  }
}
