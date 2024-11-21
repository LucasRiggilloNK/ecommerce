import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../../../../interfaces/product/product-interface';
import { ProductService } from '../../../../services/product/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  productInterfaceById: ProductInterface|null = null;

  constructor(private productService: ProductService){

  }


ngOnInit(): void {
    
}

}
