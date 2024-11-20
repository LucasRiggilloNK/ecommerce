import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Brand } from '../../models/products/brands/brand';
import { Category } from '../../models/products/categories/category';
import { ProductcCharacteristicsService } from '../../services/product/product-characteristics.service';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { ProductService } from '../../services/product/product.service';
import { response } from 'express';
import { error } from 'console';
import { toUSVString } from 'util';
import { resolveObjectURL } from 'buffer';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit{
  addProduct: FormGroup;
  categoryList: string[] = Object.values(Category);
  brandList: string[] = Object.values(Brand);
  selectedCategory: string = '';

  brand: string = '';
  category: string = '';
  urlImage: string = '';
  description: string = '';
  price: string = '';
  stock: string = '';
  characteristics: string = '';
  model: string = '';

  characteristicsString: string = '';
  productInt: ProductInterface;

  constructor(
    private productCharacteristicsService: ProductcCharacteristicsService,
    private productService: ProductService
  ) {
    this.productInt = {
      id: '0',
      brand: '',
      category: '',
      urlImage: '',
      description: '',
      price: 1,
      stock: 1,
      characteristics: '',
      model: '',
      quantity: 0,
    };

    this.addProduct = new FormGroup({
      brand: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      urlImage: new FormControl(this.urlImage, [Validators.required]),
      description: new FormControl(this.description, [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.min(0.01)]),
      stock: new FormControl('', [Validators.required, Validators.min(1)]),
      model: new FormControl(this.model, [Validators.required]),

     
    });

    
  }

  ngOnInit(): void {
    let allBrandsIndex = this.brandList.indexOf(Brand.ALL);
    this.brandList.splice(allBrandsIndex,1);

    let allCategoriesIndex = this.categoryList.indexOf(Category.ALL);
    this.categoryList.splice(allCategoriesIndex,1);

  }



  obtainCharacteristicsString() {
    //procesa y retorna un string de caracteristicas
    this.characteristicsString =
      this.productCharacteristicsService.sendCharacteristicsString();
  }

  

  async onSubmit() {
    this.obtainCharacteristicsString(); //obtiene string caracteristicas
    this.productInt = this.addProductFormToProductInterface(); //pasa el form a interface de producto
    console.log(this.productService.productExists(this.productInt));
    if(!(await this.productService.productExists(this.productInt))){
      await this.productService.addProductInterfaceApi(this.productInt);
    }else{
      alert("Producto ya existente...");
    }
    
  }

  addProductFormToProductInterface(): ProductInterface {
    let product: ProductInterface = {
      id: '0',
      brand: '',
      category: '',
      urlImage: '',
      description: '',
      price: 1,
      stock: 1,
      characteristics: '',
      model: '',
      quantity: 0,
    };

    product.brand = this.addProduct.get('brand')?.value;
    product.category = this.addProduct.get('category')?.value;
    product.characteristics = this.characteristicsString;
    product.description = this.addProduct.get('description')?.value;
    product.model = this.addProduct.get('model')?.value;
    product.price = this.addProduct.get('price')?.value;
    product.urlImage = this.addProduct.get('urlImage')?.value;
    product.stock = this.addProduct.get('stock')?.value;

    return product;
  }

  
  
}
