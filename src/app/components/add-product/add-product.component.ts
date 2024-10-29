import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Brand } from '../../models/products/brands/brand';
import { Category } from '../../models/products/categories/category';
import { ProductcCharacteristicsService } from '../../services/product/product-characteristics.service';
import { ProductInterface } from '../../interfaces/product/product-interface';

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
  image: string = "";
  description: string = "";
  price: string = "";
  stock: string = "";
  characteristics: string = "";
  model: string = "";

  product: ProductInterface;
  characteristicsString: string = "";

  constructor(private productCharacteristicsService: ProductcCharacteristicsService) {
    
    
    this.addProduct = new FormGroup ({
      'brand': new FormControl(Brand.ACER),
      'category': new FormControl(Category.NONE),
      'image': new FormControl(this.image),
      'description': new FormControl(this.description),
      'price': new FormControl(0),
      'stock': new FormControl(1),
      'characteristics': new FormControl(this.characteristics),
      'model': new FormControl(this.model)
    });

  }

  getSelectedCategory(): string {
    console.log("Category: " + this.addProduct.get('category')?.value);
    return this.addProduct.get('category')?.value;
  }

  

  obtainCharacteristicsString(){
    this.characteristicsString = this.productCharacteristicsService.sendCharacteristicsString();
  }

  onSubmit(){
//tomar los datos del formulario y utilizar el método de characteristics para agregar los datos del tipo de categoria

    this.obtainCharacteristicsString();
    console.log("En SuBMIT" + this.characteristicsString);

  }

  
}