import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { CarritoService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  carrito: ProductInterface[] = []; // Usando la interfaz ProductInterface

  constructor(carritoService: CarritoService) {
    this.loadCart(); // Cargar el carrito al inicio
    this.carrito = carritoService.getCartItems();
  }

  // Método para agregar productos al carrito
  addToCart(product: ProductInterface): void {
    const existingProduct = this.carrito.find((p) => p.id === product.id);
    if (product.stock <= 0) {
      alert('No hay suficiente stock disponible.');
      return;
    }

    if (existingProduct) {
      if (existingProduct.stock > 0) {
        existingProduct.stock--; // Reduce el stock del producto en el carrito
      } else {
        alert('No hay más stock disponible.');
      }
    } else {
      // Si no está en el carrito, agregarlo con stock reducido
      const newProduct = { ...product, stock: product.stock - 1 }; // Crear una copia del producto
      this.carrito.push(newProduct); // Agregar el producto con stock reducido
      localStorage.setItem('cart', JSON.stringify(this.carrito));
    }

    console.log(this.carrito); // Verifica el carrito después de agregar un producto
    this.saveCart(); // Guardar el carrito en localStorage
  }

  getTotalPrice(): number {
    return this.carrito.reduce(
      (total, item) => total + item.price * item.stock,
      0
    );
  }

  // Método para eliminar un producto del carrito
  removeProduct(productId: string): void {
    const index = this.carrito.findIndex(
      (p) => String(p.id) === String(productId)
    );
    if (index !== -1) {
      this.carrito.splice(index, 1);
      this.saveCart(); // Guarda el carrito después de eliminar un producto
    }
  }

  // Método para vaciar el carrito
  clearCart(): void {
    this.carrito = [];
    localStorage.removeItem('cart'); // Vacia el carrito en localStorage
    this.saveCart(); // Vacia el carrito en localStorage
    window.location.reload(); // Actualiza página
  }

  // Método para guardar el carrito en localStorage
  loadCart(): void {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.carrito = JSON.parse(savedCart) as ProductInterface[];
      }
    }
  }

  saveCart(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.carrito));
    }
  }
}
