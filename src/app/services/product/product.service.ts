import { Injectable } from '@angular/core';
import { Product } from '../../models/products/product';
import { AsyncService } from '../async.service';
import { ProductoInteface } from '../../interfaces/product/producto-inteface';
import { Brand } from '../../models/products/brands/brand';
import { Category } from '../../models/products/categories/category';
import { Image } from '../../models/products/images/image';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsApiUrl: string = "";
  protected producsList: Product[] = [];
  //private product: Product|null = null;
  private product: ProductoInteface|null = null; //Para relacionar con los campos de modificar producto

  constructor(private asyncService: AsyncService) { 
    this.product = {
    idProduct: "",
     brand: Brand.NONE,
     category: Category.NONE,
     image: new Image(""),
     description: "",
     price: 0,
     stock: 0,
     characteristics: "",
     model: ""
    }
  }

  
//////////////////////    GET PRODUCTS     ////////////////////////////////////////////////////
  public async getProductsApiUrl(){

    await this.asyncService.getAll(this.productsApiUrl)
    .then(response =>{
      this.producsList = response;/* PASAR EL RESPONSE A OBJETOS*/
    })
    .catch(reason =>{
      alert("Error de lectura API...");
    })
  }


  //////////////////////    ADD PRODUCTS     ////////////////////////////////////////////////////

  private productToInterface(product: Product): ProductoInteface{
    let productInterface: ProductoInteface = {
    idProduct: product.getIdProduct(),
     brand: product.getBrand(),
     category: product.getCategory(),
     image: product.getImage(),
     description: product.getDescription(),
     price: product.getPrice(),
     stock: product.getStock(),
     characteristics: product.getCharacteristics(),
     model: product.getModel()
    }
    
  }

 public addProduct(product: Product):void{
  /**pasar el Product a interfaz */
    /**agregar el p */
  }

}
