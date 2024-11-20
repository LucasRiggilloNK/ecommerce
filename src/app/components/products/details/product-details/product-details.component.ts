import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../../../interfaces/product/product-interface';
import { ProductService } from '../../../../services/product/product.service';
import { CarritoService } from '../../../../services/cart.service';
import { Brand } from '../../../../models/products/brands/brand';
import { Category } from '../../../../models/products/categories/category';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  productToVievDetails: ProductInterface | null = null;

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.productToVievDetails = {
      brand:  Brand.NONE,
      category: Category.NONE,
      urlImage: '',
      description: '',
      price: 0,
      stock: 0,
      characteristics: '',
      model: '',
      id: '1',
      quantity: 0,
    };
  }

  ngOnInit(): void {
    let idProducto = this.route.snapshot.paramMap.get('id');
    console.log('idProducto: ' + idProducto);
    if (idProducto != null) {
      this.productService
        .getProductInterfaceById(idProducto)
        .then((response) => {
          this.productToVievDetails = response;
          console.log(this.productToVievDetails);
        })
        .catch((error) => {
          console.log(
            'Error al obtener el producto por id para mostrar detalles...'
          );
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  addToCart(product: ProductInterface): void {
    this.carritoService.addToCart(product);
  }

  decreaseQuantity(productId: string) {
    this.carritoService.decreaseQuantity(productId);
  }
}
