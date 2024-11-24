import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductInterface } from '../../../../interfaces/product/product-interface';
import { ProductService } from '../../../../services/product/product.service';
import { CarritoService } from '../../../../services/cart.service';
import { Brand } from '../../../../models/products/brands/brand';
import { Category } from '../../../../models/products/categories/category';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/login/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  productToVievDetails: ProductInterface | null = null;
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    
    let idProducto = this.route.snapshot.paramMap.get('id');
    if (idProducto) {
      this.productService
        .getProductInterfaceById(idProducto)
        .then((response) => {
          this.productToVievDetails = response;
        })
        .catch((error) => console.log('Error al obtener producto', error));
    }

    this.cartSubscription = this.carritoService
      .getCartItems()
      .subscribe((cartItems) => {
        if (this.productToVievDetails) {
          const cartItem = cartItems.find(
            (item) => item.id === this.productToVievDetails?.id
          );
          if (cartItem) {
            this.productToVievDetails.quantity = cartItem.quantity;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

  addToCart(product: ProductInterface): void {
    this.carritoService.addToCart(product);
  }

  decreaseQuantity(productId: string): void {
    this.carritoService.decreaseQuantity(productId);
  }

  isLoggedIN(): boolean {
    return this.authService.isLoggedIn();
  }
}
