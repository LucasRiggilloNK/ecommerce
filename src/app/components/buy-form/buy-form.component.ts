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
import { Card } from '../../interfaces/cards/card';
import { FormBuilder, FormArray } from '@angular/forms';
import { PurchaseService } from '../../services/purchase-service/purchase-service.service';
import { Purchase } from '../../models/purchases/purchase';
import { CustomValidators } from '../../common/custom-validators';
import { validateHeaderName } from 'http';

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
  calculateDistance: number;
  isVisible: boolean = false;
  isCollapsed = false;

  constructor(
    private buyService: BuyService,
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private authService: AuthService
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
      address: new FormControl('', [Validators.required]),
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
      province: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      cardType: new FormControl('', Validators.required),
      cardHolder: new FormControl('', Validators.required),
      cardNumber: new FormControl('', [
        Validators.required,
        Validators.maxLength(16),
      ]),
      expirationDate: new FormControl('', Validators.required),
      cvv: new FormControl('', [
        Validators.required,
        Validators.maxLength(3),
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

  onsubmit() {
    const nuevaCompra: Purchase = {
      clienteId: this.userDataForm.value.clienteId,
      productos: this.userDataForm.value.productos,
      total: this.userDataForm.value.total,
      fecha: new Date().toISOString(),
    };
    this.purchaseService.agregarCompra(nuevaCompra).subscribe(
      (response) => {
        console.log('Compra registrada con éxito:', response);
      },
      (error) => {
        console.error('Error al registrar la compra:', error);
      }
    );
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
  }

  setInitialUserDataForm(user: User) {
    this.userDataForm.get('name')?.setValue(user.name);
    this.userDataForm.get('lastname')?.setValue(user.lastname);
    this.userDataForm.get('birthdate')?.setValue(user.birthdate);
    this.userDataForm.get('postalCode')?.setValue(user.postalCode);
    this.userDataForm.get('email')?.setValue(user.email);
    this.userDataForm.get('country')?.setValue('Argentina');
    this.userDataForm.get('province')?.setValue('Buenos Aires');
    this.userDataForm.get('city')?.setValue('Mar del Plata');
  }

  getSubtotal() {
    return this.buyService.getSubtotal();
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
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

        this.calculateDistance =
          this.distanceMatrixObject.rows[0].elements[0].distance.value;
        console.log('Distancia: ' + this.calculateDistance);
        this.shippingPrice =
          (this.calculateDistance * this.shippingCostByKm) / 1000;
        this.userDataForm.get('sendPrice')?.setValue(this.shippingPrice);
      })
      .catch((error) => {
        console.error(error);
        //alert('Dirección inexistente...');
      });
  }

  getTotalBuy() {
    return this.subTotalPrice + this.shippingPrice;
  }

  get productos(): FormArray {
    return this.userDataForm.get('productos') as FormArray;
  }

  agregarProducto() {
    this.productos.push(
      this.fb.group({
        productoId: [''],
        cantidad: [''],
      })
    );
  }

  cardExists(): boolean {
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

    return this.buyService.existsCard(card);
  }
}
