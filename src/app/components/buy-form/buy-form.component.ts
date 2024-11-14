import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { CarritoService } from '../../services/cart.service';
import { BuyService } from '../../services/buy.service';
import { User } from '../../services/register-service/register.service';
import { AuthService } from '../../services/login/auth.service';
import { error } from 'console';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buy-form',
  templateUrl: './buy-form.component.html',
  styleUrl: './buy-form.component.css'
})
export class BuyFormComponent implements OnInit{
   cartItems: ProductInterface[] = [];
   user: User | null;
   subTotalPrice: number;
   userDataForm: FormGroup;


   

  constructor(private buySeervice: BuyService, private authService: AuthService){
    this.user = null;
    this.subTotalPrice = 0;
    this.userDataForm = new FormGroup({
      "name": new FormControl('', Validators.required),
      "lastname": new FormControl('', Validators.required),
      "birthdate": new FormControl('', Validators.required),
      "address": new FormControl('', Validators.required),
      "postalCode": new FormControl('', Validators.required),
      "email": new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
      this.cartItems = this.buySeervice.getCartItemsToBuy();
      this.subTotalPrice = this.buySeervice.getSubtotal();

      let userId: string | null = this.authService.getUserId();
      console.log('id ' + userId);
      if(userId !== null){
        this.buySeervice.getUser(userId).subscribe(
        response => {
          this.user = response;
        },error => {
          console.error('No se pudo obtener usuario por id');
        }
      );
      }

  }

  getSubtotal(){
    return this.buySeervice.getSubtotal();
  }

}