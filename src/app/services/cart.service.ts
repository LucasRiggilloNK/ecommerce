import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductInterface } from '../interfaces/product/product-interface';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private cart: ProductInterface[] = [];
  private cartSubject = new BehaviorSubject<ProductInterface[]>([]);
  private cartQuantitySource = new BehaviorSubject<number>(0);
  private cartStockSource = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCart();
  }

  getCartItems() {
    return this.cartSubject.asObservable();
  }

  getTotalQuantity(): Observable<number> {
    return this.cartQuantitySource.asObservable();
  }

  getCartStock(): Observable<number> {
    return this.cartStockSource.asObservable();
  }

  addToCart(product: ProductInterface): void {
    const existingProduct = this.cart.find((p) => p.id === product.id);
    if (product.stock <= 0) {
      alert('No hay suficiente stock disponible.');
      return;
    }

    if (existingProduct) {
      if (existingProduct.stock > 0) {
        existingProduct.quantity++;
      } else {
        alert('No hay más stock disponible.');
      }
    } else {
      const newProduct = { ...product, quantity: 1 };
      this.cart.push(newProduct);
    }

    this.saveCart();
    this.cartSubject.next(this.cart);
    this.updateCartInfo();
  }

  decreaseQuantity(productId: string): void {
    const existingProduct = this.cart.find((p) => p.id === productId);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity--;
      } else {
        this.removeProduct(productId);
      }
    }
    this.saveCart();
    this.cartSubject.next(this.cart);
    this.updateCartInfo();
  }

  addToCartById(productId: string): void {
    const product = this.cart.find((p) => p.id === productId);
    if (product && product.stock > product.quantity) {
      product.quantity++;
      this.saveCart();
      this.cartSubject.next(this.cart);
      this.updateCartInfo();
    }
  }

  removeProduct(productId: string): void {
    this.cart = this.cart.filter((p) => p.id !== productId);
    this.saveCart();
    this.cartSubject.next(this.cart);
    this.updateCartInfo();
  }

  clearCart(): void {
    this.cart = [];
    localStorage.removeItem('cart');
    this.cartSubject.next(this.cart);
    this.updateCartInfo();
  }

  private loadCart(): void {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cart = JSON.parse(savedCart) as ProductInterface[];
        this.cartSubject.next(this.cart);
        this.updateCartInfo();
      }
    }
  }

  getTotalPrice(): number {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private updateCartInfo(): void {
    const totalQuantity = this.cart.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const totalStock = this.cart.length;
    this.cartQuantitySource.next(totalQuantity);
    this.cartStockSource.next(totalStock);
  }
}
