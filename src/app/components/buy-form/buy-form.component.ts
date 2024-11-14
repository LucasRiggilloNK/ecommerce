import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { CarritoService } from '../../services/cart.service';
import { BuyService } from '../../services/buy.service';
import { User } from '../../services/register-service/register.service';
import { AuthService } from '../../services/login/auth.service';
import { error } from 'console';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DistanceMatrixService } from '../../services/distance/distance-matrix.service';
import { DistanceMatrix } from '../../interfaces/distance-matrix';

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
   shippingCostByKm: number = 100;
   shippingPrice: number;
   distanceMatrixObject: DistanceMatrix;
   calculateDistance: number;


   

  constructor(private buyService: BuyService, private authService: AuthService){
    this.user = null;
    this.subTotalPrice = 0;
    this.userDataForm = new FormGroup({
      "name": new FormControl('', Validators.required),
      "lastname": new FormControl('', Validators.required),
      "birthdate": new FormControl('', Validators.required),
      "address": new FormControl('', Validators.required),
      "postalCode": new FormControl('', Validators.required),
      "email": new FormControl('', Validators.required),
      "country": new FormControl('', Validators.required),
      "province": new FormControl('', Validators.required),
      "city": new FormControl('', Validators.required)
    });

    this.distanceMatrixObject = {
      "destination_addresses": [
          ""
      ],
      "origin_addresses": [
          ""
      ],
      "rows": [
          {
              "elements": [
                  {
                      "distance": {
                          "text": "",
                          "value": 0
                      },
                      "duration": {
                          "text": "",
                          "value": 0
                      },
                      "origin": "",
                      "destination": "",
                      "status": ""
                  }
              ]
          }
      ],
      "status": ""
  }


    this.shippingPrice = 0;
    this.calculateDistance = 0;
    
  }

  ngOnInit(): void {
      this.cartItems = this.buyService.getCartItemsToBuy();
      this.subTotalPrice = this.buyService.getSubtotal();

      let userId: string | null = this.authService.getUserId();
      console.log('id ' + userId);
      if(userId !== null){
        this.buyService.getUser(userId).subscribe(
        response => {
          this.user = response;
          this.setInitialUserDataForm(this.user);
        },error => {
          console.error('No se pudo obtener usuario por id');
        }
      );
      }

  }

  setInitialUserDataForm(user: User){
    this.userDataForm.get("name")?.setValue(user.name);
    this.userDataForm.get("lastname")?.setValue(user.lastname);
    this.userDataForm.get("birthdate")?.setValue(user.birthdate);
    this.userDataForm.get("postalCode")?.setValue(user.postalCode);
    this.userDataForm.get("email")?.setValue(user.email);
    this.userDataForm.get("country")?.setValue("Argentina");
    this.userDataForm.get("province")?.setValue("Buenos Aires");
    this.userDataForm.get("city")?.setValue("Mar del Plata");
    this.userDataForm.get("address")?.setValue(user.address);
  }


  getSubtotal(){
    return this.buyService.getSubtotal();
  }




  getShippingPrice(){
    

    let destiny = this.userDataForm.get("address")?.value + ", " + this.userDataForm.get("city")?.value + ", " + 
                  this.userDataForm.get("province")?.value + ", " + this.userDataForm.get("country")?.value;
    console.log("Destino: " + destiny);



    //this.distanceMatrixService.getApiDistanceMatrix(destiny)
    this.buyService.getShippingPrice(destiny)
    .then(response =>{ 
      this.distanceMatrixObject = response as DistanceMatrix;
      
      this.calculateDistance = this.distanceMatrixObject.rows[0].elements[0].distance.value;
      console.log("Distancia: " + this.calculateDistance);
      this.shippingPrice = this.calculateDistance*this.shippingCostByKm/1000;
      this.userDataForm.get("sendPrice")?.setValue(this.shippingPrice);
      
  })
  .catch(error => {
      alert("Dirección inexistente...");
     
  });
  }

  getTotalBuy(){
    return (this.subTotalPrice + this.shippingPrice);
  }


}