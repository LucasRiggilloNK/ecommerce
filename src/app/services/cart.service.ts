// carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductInterface } from '../interfaces/product/product-interface';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  // Estado del carrito, inicializado como un array vacío
  public carrito: ProductInterface[] = [];
  private cartItemsSource = new BehaviorSubject<ProductInterface[]>([]);
  cartItems$ = this.cartItemsSource.asObservable();

  constructor() {
    console.log('dcwegewgergeh45h');
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');

      console.log(savedCart);
      if (savedCart) {
        this.cartItemsSource.next(JSON.parse(savedCart));
      }
    }
  }

  // Agregar producto al carrito
  addToCart(product: ProductInterface): void {
    const currentItems = this.cartItemsSource.value;
    const productInCart = currentItems.find((item) => item.id === product.id);

    if (productInCart) {
      productInCart.stock += 1;
    } else {
      currentItems.push({ ...product, stock: 1 });
    }

    this.cartItemsSource.next(currentItems);

    // Guardar el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(currentItems));
  }

  // Obtener el total del precio de los productos en el carrito
  getTotalPrice(): number {
    return this.cartItemsSource.value.reduce(
      (total, item) => total + item.price * item.stock,
      0
    );
  }

  // Obtener todos los productos del carrito
  getCartItems(): ProductInterface[] {
    return this.cartItemsSource.value;
  }
}
