import { Injectable } from '@angular/core';
import { ProductInterface } from '../interfaces/product/product-interface';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  // Estado del carrito, inicializado como un array vacío
  private cartItemsSource: ProductInterface[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItemsSource = JSON.parse(savedCart);
      }
    }
  }

  // Agregar producto al carrito
  addToCart(product: ProductInterface): void {
    const productInCart = this.cartItemsSource.find(
      (item) => item.id === product.id
    );

    if (productInCart) {
      productInCart.stock += 1;
    } else {
      this.cartItemsSource.push({ ...product, stock: 1 });
    }

    // Guardar el carrito actualizado en localStorage
    this.saveCart();
  }

  // Obtener el total del precio de los productos en el carrito
  getTotalPrice(): number {
    return this.cartItemsSource.reduce(
      (total, item) => total + item.price * item.stock,
      0
    );
  }

  // Obtener todos los productos del carrito
  getCartItems(): ProductInterface[] {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItemsSource = JSON.parse(savedCart);
      }
    }
    return this.cartItemsSource;
  }

  // Guardar el carrito en localStorage
  private saveCart(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cartItemsSource));
    }
  }
}
