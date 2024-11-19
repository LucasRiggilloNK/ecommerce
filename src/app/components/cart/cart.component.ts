import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { CarritoService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  carrito: ProductInterface[] = [];
  quantity: number;
  totalQty: number = 0;
  private qtySubscription: Subscription = new Subscription();

  constructor(private carritoService: CarritoService) {
    this.quantity = 0;
  }

  ngOnInit(): void {
    // Obtener el carrito y la cantidad total
    this.carritoService.getCartItems().subscribe((cart) => {
      this.carrito = cart;
    });

    // Suscribirse a la cantidad total para actualizarla dinámicamente
    this.qtySubscription = this.carritoService
      .getTotalQuantity()
      .subscribe((qty) => {
        this.totalQty = qty;
      });
  }

  addToCart(product: ProductInterface): void {
    this.carritoService.addToCart(product);
  }

  decreaseQuantity(productId: string): void {
    this.carritoService.decreaseQuantity(productId);
  }

  getTotalPrice(): number {
    return this.carrito.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  removeProduct(productId: string): void {
    this.carritoService.removeProduct(productId);
  }

  clearCart(): void {
    this.carritoService.clearCart();
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.qtySubscription) {
      this.qtySubscription.unsubscribe();
    }
  }
}
