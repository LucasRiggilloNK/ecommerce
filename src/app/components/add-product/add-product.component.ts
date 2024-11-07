import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Brand } from '../../models/products/brands/brand';
import { Category } from '../../models/products/categories/category';
import { ProductcCharacteristicsService } from '../../services/product/product-characteristics.service';
import { ProductInterface } from '../../interfaces/product/product-interface';

import { Product } from '../../models/products/product';
import { ProductService } from '../../services/product/product.service';
import { response } from 'express';
import { error } from 'console';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  addProduct: FormGroup;
  categoryList: string[] = Object.values(Category);
  brandList: string[] = Object.values(Brand);
  selectedCategory: string = "";

  brand: string = "";
  category: string = "";
  urlImage: string = "";
  description: string = "";
  price: string = "";
  stock: string = "";
  characteristics: string = "";
  model: string = "";


  characteristicsString: string = "";
  productInt: ProductInterface;

  constructor(private productCharacteristicsService: ProductcCharacteristicsService, private productService: ProductService) {
    
    this.productInt= {
      id: 0,
      brand: "",
      category: "",
      urlImage: "",
      description: "",
      price: 1,
      stock: 1,
      characteristics: "",
      model: ""
    }

    this.addProduct = new FormGroup ({
      'brand': new FormControl(Brand.NONE, [Validators.required]),
      'category': new FormControl(Category.NONE, [Validators.required]),
      'urlImage': new FormControl(this.urlImage, [Validators.required]),
      'description': new FormControl(this.description, [Validators.required]),  
      'price': new FormControl('', [Validators.required, Validators.min(0.01)]),
      'stock': new FormControl('', [Validators.required, Validators.min(1)]),
      'model': new FormControl(this.model, [Validators.required])

      //VER VALIDATORS ARRIBA!!!----------------------------------------------------

/*       'brand': new FormControl(Brand.NONE),
      'category': new FormControl(Category.NONE),
      'urlImage': new FormControl(this.image),
      'description': new FormControl(this.description),  
      'price': new FormControl(''),
      'stock': new FormControl(''),
      'characteristics': new FormControl(this.characteristics),
      'model': new FormControl(this.model) */
    });

  }

  /* getSelectedCategory(): string {
    console.log("Category: " + this.addProduct.get('category')?.value);
    return this.addProduct.get('category')?.value;
  } */

  

  obtainCharacteristicsString(){//procesa y retorna un string de caracteristicas
    this.characteristicsString = this.productCharacteristicsService.sendCharacteristicsString();
  }

  /* onSubmit(){//FUNCIONA

    this.obtainCharacteristicsString();//obtiene string caracteristicas
    this.productInt = this.addProductFromToProductInterface();//pasa el form a interface de producto
    this.productService.addProductInterfaceApi(this.productInt).subscribe(
      response =>{
        alert("Producto agregado...")
      },error =>{
        alert("No se pudo agregar el producto....");
      }
    );// agrega el productoInterface en el json

  } */

  async onSubmit(){

    this.obtainCharacteristicsString();//obtiene string caracteristicas
    this.productInt = this.addProductFromToProductInterface();//pasa el form a interface de producto
    await this.productService.addProductInterfaceApi(this.productInt);

  }

  addProductFromToProductInterface(): ProductInterface{
    let product:ProductInterface =  {
      id: 0,
      brand: "",
      category: "",
      urlImage: "",
      description: "",
      price: 1,
      stock: 1,
      characteristics: "",
      model: ""
    };

    
    product.brand = this.addProduct.get('brand')?.value;
    product.category = this.addProduct.get('category')?.value;
    product.characteristics = this.characteristicsString;
    product.description = this.addProduct.get('description')?.value;
    product.model = this.addProduct.get('model')?.value;
    product.price = this.addProduct.get('price')?.value;
    product.urlImage = this.addProduct.get('urlImage')?.value;
    product.stock = this.addProduct.get('stock')?.value;
    

    /* const { id, ...productWithoutId } = product;

    return productWithoutId as ProductInterface; */
    return product;
  }


  /* public getHigherProductId(): number{
    let productsListInt: ProductInterface[] = [];
    let maxId = 0;
    this.getProductsListInterfaceObservable().subscribe(
      response =>{
        productsListInt = response;
        console.log("productsListInt");
        console.log(this.productsListInt);
        productsListInt.forEach(product =>{
          if(product.id > maxId){
            maxId = product.id;
          }
        });
      }, error => {
        alert("No se pudo leer el json productos...")
      }
    );
  
    
    return maxId;
  
  } */
  
}