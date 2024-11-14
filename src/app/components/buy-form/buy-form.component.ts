import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { CarritoService } from '../../services/cart.service';
import { BuyService } from '../../services/buy.service';
import { User } from '../../services/register-service/register.service';

@Component({
  selector: 'app-buy-form',
  templateUrl: './buy-form.component.html',
  styleUrl: './buy-form.component.css'
})
export class BuyFormComponent implements OnInit{
   cartItems: ProductInterface[] = [];
   user: User | null;

  constructor(private buySeervice: BuyService){
    this.user = null;
  }

  ngOnInit(): void {
      this.cartItems = this.buySeervice.getCartItemsToBuy();
      
  }



}