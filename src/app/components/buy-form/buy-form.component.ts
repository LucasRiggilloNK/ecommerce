import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { BuyService } from '../../services/buy.service';
import { User } from '../../services/register-service/register.service';
import { AuthService } from '../../services/login/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DistanceMatrixService } from '../../services/distance/distance-matrix.service';
import { DistanceMatrix } from '../../interfaces/distance-matrix';
import { Card } from '../../interfaces/cards/card';
import { FormBuilder, FormArray } from '@angular/forms';
import { PurchaseService } from '../../services/purchase-service/purchase-service.service';
import { Purchase } from '../../models/purchases/purchase';
import { CustomValidators } from '../../common/custom-validators';
import { Province } from '../../models/province';
import { BsasCity } from '../../models/bsas-city';
import { CardType } from '../../models/cardType';
import { CardIssuer } from '../../models/card-issuer';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import Swal from 'sweetalert2';
import { CardsService } from '../../services/cards.service';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-purchase',
  templateUrl: './buy-form.component.html',
  styleUrls: ['./buy-form.component.css'],
})
export class BuyFormComponent implements OnInit {
  cartItems: ProductInterface[] = [];
  user: User | null;
  subTotalPrice: number;
  userDataForm: FormGroup;
  shippingCostByKm: number = 100;
  shippingPrice: number;
  distanceMatrixObject: DistanceMatrix;
  destination_addresses: string = '';
  calculateDistance: number;
  provincesList: string[] = Object.values(Province);
  bsasCityList: string[] = Object.values(BsasCity);
  cardsTypesList: string[] = Object.values(CardType);
  cardIssuerList: string[] = Object.values(CardIssuer);

  verifyCard: boolean = false;

  constructor(
    private buyService: BuyService,
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private cardService: CardsService
  ) {
    this.userDataForm = this.fb.group({
      clienteId: [''],
      productos: this.fb.array([]),
    });
    this.user = null;
    this.subTotalPrice = 0;
    this.userDataForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        CustomValidators.lettersOnly(),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        CustomValidators.lettersOnly(),
      ]),
      street: new FormControl('', [Validators.required]),
      streetNumber: new FormControl('', [
        Validators.required,
        CustomValidators.numbersOnly(),
      ]),
      flat: new FormControl(''),
      floor: new FormControl(''),
      email: new FormControl('', [
        Validators.required,
        CustomValidators.emailDomainValidator,
      ]),
      country: new FormControl('', Validators.required),
      province: new FormControl(Province.BuenosAires, Validators.required),
      city: new FormControl('', Validators.required),
      cardType: new FormControl(CardType.CREDITO, Validators.required),
      cardHolder: new FormControl('', [
        Validators.required,
        CustomValidators.lettersOnly(),
      ]),
      cardNumber: new FormControl('', [
        Validators.required,
        Validators.maxLength(16),
        Validators.minLength(16),
        CustomValidators.numbersOnly(),
      ]),
      expirationDate: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ]),
      cvv: new FormControl('', [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3),
        CustomValidators.numbersOnly(),
      ]),
      cardIssuer: new FormControl('', Validators.required),
    });

    this.distanceMatrixObject = {
      destination_addresses: [''],
      origin_addresses: [''],
      rows: [
        {
          elements: [
            {
              distance: {
                text: '',
                value: 0,
              },
              duration: {
                text: '',
                value: 0,
              },
              origin: '',
              destination: '',
              status: '',
            },
          ],
        },
      ],
      status: '',
    };

    this.shippingPrice = 0;
    this.calculateDistance = 0;
  }

  ngOnInit(): void {
    this.buyService.getCartItemsToBuy().subscribe((items) => {
      this.cartItems = items;
    });
    this.subTotalPrice = this.buyService.getSubtotal();

    let userId: string | null = this.authService.getUserId();
    console.log('id ' + userId);
    if (userId !== null) {
      this.buyService.getUser(userId).subscribe(
        (response) => {
          this.user = response;
          this.setInitialUserDataForm(this.user);
        },
        (error) => {
          console.error('No se pudo obtener usuario por id');
        }
      );
    }


    this.userDataForm.valueChanges.subscribe(() => {
      if (this.userDataForm.get('cardType')?.valid &&
          this.userDataForm.get('cardHolder')?.valid &&
          this.userDataForm.get('cardNumber')?.valid &&
          this.userDataForm.get('expirationDate')?.valid &&
          this.userDataForm.get('cardNumber')?.valid &&
          this.userDataForm.get('cvv')?.valid &&
          this.userDataForm.get('cardIssuer')?.valid){

          this.cardExists()
          .then(response =>{
            this.verifyCard = response;
            console.log("verifyCard: " + this.verifyCard);
          });
          
          

      }
    });
  }

  setInitialUserDataForm(user: User) {
    this.userDataForm.get('name')?.setValue(user.name);
    this.userDataForm.get('lastname')?.setValue(user.lastname);
    this.userDataForm.get('email')?.setValue(user.email);
    this.userDataForm.get('country')?.setValue('Argentina');
    this.userDataForm.get('province')?.setValue(Province.BuenosAires);
    this.userDataForm.get('city')?.setValue(BsasCity.MarDelPlata);
    this.userDataForm.get('cardType')?.setValue(CardType.CREDITO);
    this.userDataForm.get('cardIssuer')?.setValue(CardIssuer.VISA);
    this.userDataForm.get('street')?.setValue(user.street);
    this.userDataForm.get('streetNumber')?.setValue(user.streetNumber);
    this.userDataForm.get('flat')?.setValue(user.flat);
    this.userDataForm.get('floor')?.setValue(user.floor);
  }

  getSubtotal() {
    return this.buyService.getSubtotal();
  }

  getShippingPrice() {
    let destiny =
      this.userDataForm.get('street')?.value +
      ' ' +
      this.userDataForm.get('streetNumber')?.value +
      ', ' +
      this.userDataForm.get('city')?.value +
      ', ' +
      this.userDataForm.get('province')?.value +
      ', ' +
      this.userDataForm.get('country')?.value;
    console.log('Destino: ' + destiny);

    this.buyService
      .getShippingPrice(destiny)
      .then((response) => {
        this.distanceMatrixObject = response as DistanceMatrix;
        console.log(this.distanceMatrixObject);

        if (this.distanceMatrixObject.rows[0].elements[0].status == 'OK') {
          console.log(
            'Domicilio entrega: ' +
              this.distanceMatrixObject.destination_addresses[0]
          );
          this.destination_addresses =
            this.distanceMatrixObject.destination_addresses[0];

          this.calculateDistance =
            this.distanceMatrixObject.rows[0].elements[0].distance.value;
          console.log('Distancia: ' + this.calculateDistance);
          this.shippingPrice =
            (this.calculateDistance * this.shippingCostByKm) / 1000;
          this.userDataForm.get('sendPrice')?.setValue(this.shippingPrice);
        } else if (
          this.distanceMatrixObject.rows[0].elements[0].status == 'ZERO_RESULTS'
        ) {
          this.destination_addresses = '';
          console.log('Dirección inexistente...');
        }
      })
      .catch((error) => {
        this.destination_addresses = '';
        console.log('Error calculo distancia...');
        console.error(error);
        alert('Dirección inexistente...');
      });
  }

  getTotalBuy() {
    return this.subTotalPrice + this.shippingPrice;
  }

  get productos(): FormArray {
    return this.userDataForm.get('productos') as FormArray;
  }

  generatePurchase() {
    Swal.fire({
      title: '¿Confirmar compra?',
      text: 'Estás a punto de confirmar tu compra.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      backdrop: true,
      customClass: {
        popup: 'custom-swal-dark',
        title: 'custom-title-dark',
        confirmButton: 'custom-confirm-button-dark',
        cancelButton: 'custom-cancel-button-dark',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const productos: { id: string; quantity: number }[] = [];
        this.cartItems.forEach(({ id, quantity }) => {
          productos.push({ id, quantity });
        });

        const idCliente = this.authService.getUserId();
        const total = this.getTotalBuy();
        const nuevaCompra: Purchase = {
          clienteId: idCliente,
          productos: productos,
          fecha: new Date(),
          total: total,
        };

        this.purchaseService.agregarCompra(nuevaCompra).subscribe(
          (response) => {
            console.log('Compra registrada con éxito:', response);

            productos.forEach((producto) => {
              this.productService.updateProductStock(
                producto.id,
                producto.quantity
              );
            });

            localStorage.removeItem('cart');
            this.router.navigate(['/']);
            setTimeout(() => {
              window.location.reload();
            }, 100);
          },
          (error) => {
            console.error('Error al registrar la compra:', error);
          }
        );
      } else {
        Swal.fire({
          title: 'Compra cancelada',
          text: 'No se realizaron cambios.',
          icon: 'info',
          customClass: {
            popup: 'custom-swal-dark',
          },
        });
      }
    });
  }

  agregarProducto() {
    this.productos.push(
      this.fb.group({
        productoId: [''],
        cantidad: [''],
      })
    );
  }

   async cardExists(): Promise<boolean> {
    let out: boolean = false;
    let card: Card = {
      type: '',
      cardHolder: '',
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      issuer: '',
    };

    card.type = this.userDataForm.get('cardType')?.value;
    card.cardHolder = this.userDataForm.get('cardHolder')?.value;
    card.cardNumber = this.userDataForm.get('cardNumber')?.value;
    card.expirationDate = this.userDataForm.get('expirationDate')?.value;
    card.cvv = this.userDataForm.get('cvv')?.value;
    card.issuer = this.userDataForm.get('cardIssuer')?.value;
    
    return await this.cardService.existsCard(card);


  }




}
