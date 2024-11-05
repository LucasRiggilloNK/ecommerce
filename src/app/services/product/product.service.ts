import { Injectable, numberAttribute, OnInit } from '@angular/core';
import { Product } from '../../models/products/product';
import { AsyncService } from '../async.service';
import { Brand } from '../../models/products/brands/brand';
import { Category } from '../../models/products/categories/category';
import { Image } from '../../models/products/images/image';
import { rootCertificates } from 'tls';
import { response } from 'express';
import { publicDecrypt } from 'crypto';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { error } from 'console';
import { materialize, max, Observable, Subscribable, Subscription } from 'rxjs';
import { basename } from 'path';
import { validateHeaderName } from 'http';
import { emitWarning, setUncaughtExceptionCaptureCallback } from 'process';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements OnInit{
  private productsApiUrl: string = "http://localhost:4000/products";
  /* private airesAcondicionadoApiUrl: string = "";
  private aspiradorasApiUrl: string = "";
  private auricularesApiUrl: string = "";
  private celularesApiUrl: string = "";
  private computadorasEscritorioApiUrl: string = "";
  private heladerasApiUrl: string = "";
  private impresorasApiUrl: string = "";
  private lavarropasApiUrl: string = "";
  private microondasApiUrl: string = "";
  private mousesApiUrl: string = "";
  private notebooksApiUrl: string = "";
  private parlantesApiUrl: string = "";
  private tabletsApiUrl: string = "";
  private tecladosApiUrl: string = "";
  private televisoresApiUrl: string = "";
  private tostadorasApiUrl: string = "";
  private ventiladoresApiUrl: string = ""; */
  private productsObjectList: Product[] = [];
  private productsListInt: ProductInterface[] = [];
  private product: Product|null = null;
  private productInt: ProductInterface|null = null; //Para relacionar con los campos de modificar producto
  private productAddedInt: ProductInterface|null = null;
  


  constructor(private asyncService: AsyncService) { 
    this.productInt = {
    id: 1,
    brand: Brand.NONE,
    category: Category.NONE,
    urlImage: "",
    description: "",
    price: 0,
    stock: 0,
    characteristics: "",
    model: ""
    }
    
  }

 ngOnInit(): void {
  
 }



 
  
//////////////////////    GET PRODUCTS     ////////////////////////////////////////////////////



/* private obtainProductsListInterface(){
  this.asyncService.getAll(this.productsApiUrl).subscribe(
    response =>{
      this.productsListInt = response;
    }, error =>{
      alert("Error de lectura metodo GET de API products.json...");
    }
  );
  
} */




public getProductsListInterfaceObservable(){
  return this.asyncService.getAll(this.productsApiUrl);
}
public getAllProductsListInterface(): Promise<ProductInterface[]>{
  
  return this.asyncService.getAllPromise(this.productsApiUrl)
  .then(response =>{
    return response;
  })
  .catch(error =>{
    alert("Error al obtener productos de archivo json");
    return [];
  });

  
}


/* public getProductsListInterfacePromise(): Promise<ProductInterface>{
  return this.asyncService.getAllPromise(this.productsApiUrl);
} */

  //////////////////////    ADD PRODUCTS     ////////////////////////////////////////////////////

  private productToInterface(product: Product): ProductInterface{
    let productInterface: ProductInterface = {
      id: product.getId(),
     brand: product.getBrand(),
     category: product.getCategory(),
     urlImage: product.getImage().getUrl(),
     description: product.getDescription(),
     price: product.getPrice(),
     stock: product.getStock(),
     characteristics: product.getCharacteristics(),
     model: product.getModel()
    }
    return productInterface;
  }


  /* public addProductApi(product: Product):Observable<ProductInterface>{//PASAR A PROMISE VER COMO SE AHCE EN EL GET

    return this.asyncService.add(this.productToInterface(product), this.productsApiUrl);
  
  } */

 /* public addProductInterfaceApi(productInt: ProductInterface){//FUNCIONA
  return this.asyncService.add(productInt, this.productsApiUrl);
 } */

 public addProductInterfaceApi(productInt: ProductInterface): Promise<ProductInterface | null>{
  return this.asyncService.add(productInt, this.productsApiUrl)
  .then(response =>{
    alert("Producto agregado existosamente...");
    return response;
  })
  .catch(error =>{
    alert("Error al agregar producto al archivo json");
    return null;
  });
 }





  //////////////////////    GET BY ID     ////////////////////////////////////////////////////

/* getProductInterfaceById(id: number){CON observable
  return this.asyncService.getById(id, this.productsApiUrl + "/");
} */

getProductInterfaceById(id: number): Promise<ProductInterface | null>{//COn promise
  return this.asyncService.getByIdPromise(id, this.productsApiUrl + "/")
  .then(response => {
    return response;
  }).catch(error => {
    alert("Error al obtener producto por ID o producto inexistente");
    return null;
  });;
}


 filterByCategory(producListInterface: ProductInterface[], category: string): ProductInterface[]{//si no hay productos retorna un array vacío
  let salida: ProductInterface[] = [];
  
  /* await this.getProductsListInterfacePromise()
        .then(response =>{
          salida = response;
          })
        .catch(); */


  return producListInterface.filter(product => product.category == category);
}

filterByBrand(producListInterface: ProductInterface[], brand: string):ProductInterface[]{
  return producListInterface.filter(product => product.brand == brand);
}


}