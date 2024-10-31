import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductInterface } from '../../../../interfaces/product/product-interface';
import { ProductService } from '../../../../services/product/product.service';
import { Product } from '../../../../models/products/product';
import { Brand } from '../../../../models/products/brands/brand';
import { Category } from '../../../../models/products/categories/category';
import { Image } from '../../../../models/products/images/image';
import { FormControl, FormGroup } from '@angular/forms';
import { response } from 'express';
import { error } from 'console';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css',
})
export class ViewProductComponent implements OnInit, OnDestroy {
  productsListInt: ProductInterface[] = [];
  productInterfaceById: ProductInterface | null = null;

  subscriptionGetProductListInterface: Subscription;
  subscriptionGetProductInterfaceById: Subscription;

  formControlById: FormControl;

  constructor(private productService: ProductService) {
    this.subscriptionGetProductListInterface = new Subscription();
    this.subscriptionGetProductInterfaceById = new Subscription();
    this.formControlById = new FormControl();
  }
  ngOnInit(): void {
    this.getProductListInterface();
  }
  ngOnDestroy(): void {
    this.subscriptionGetProductListInterface.unsubscribe();
  }

  //////////////////////////////7   GET    //////////////////////////////////////////////////
  /* getProductListInterface(){
    
    this.subscriptionGetProductListInterface = this.productService.getProductsListInterfaceObservable().subscribe(
      response =>{
        this.productsListInt = response;
      }, error =>{
        alert("Error de lectura metodo GET de API products.json...");
      }
    );
    console.log("*");
    console.log(this.productsListInt);
    
  } */

  async getProductListInterface() {
    this.subscriptionGetProductListInterface = await this.productService
      .getProductsListInterfaceObservable()
      .subscribe(
        (response) => {
          this.productsListInt = response;
        },
        (error) => {
          alert('Error de lectura metodo GET de API products.json...');
        }
      );
    console.log('*');
    console.log(this.productsListInt);
  }

  //////////////////////////   ADD    ///////////////////////////////////////77
  addGenericProduct() {
    let product = new Product();
    product.setId(this.productsListInt.length + 1);
    product.setBrand(Brand.APPLE);
    product.setCategory(Category.CELULARES);
    product.setCharacteristics('5456fd4f');
    product.setDescription('BLA BLA BLA');
    product.setImage(new Image('IMAGEN URL'));
    product.setModel('LG445588');
    product.setPrice(500000);
    product.setStock(1000);

    this.productService.addProductApi(product).subscribe(
      (response) => {
        this.getProductListInterface();
      },
      (error) => {
        alert('Error al agregar producto...');
      }
    );

    //this.getProductListInterface();
  }

  //////////////////////////////////////7   GET BY ID   ///////////////////////////////////////////////////777
  //getProductInterfaceById(id: number){
  getProductInterfaceById(id: number) {
    //let id = this.formControlById.getRawValue();
    this.subscriptionGetProductInterfaceById = this.productService
      .getProductInterfaceById(id)
      .subscribe(
        (response) => {
          this.productInterfaceById = response;
          console.log('Producto encontrado: ');
          console.log(this.productInterfaceById);
        },
        (error) => {
          alert('Error: no se encontró el producto por id...' + error);
        }
      );
  }

  buttonDetails(id: number) {
    this.getProductInterfaceById(id);
  }
}
