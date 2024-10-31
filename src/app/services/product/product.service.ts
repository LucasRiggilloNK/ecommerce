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
import { emitWarning } from 'process';

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





 /* private getProductsApiUrl():Promise<ProductInterface[]>{//el observable se transforma en ProductIntetface[] a través de suscriber

     await this.asyncService.getAll(this.productsApiUrl).subscribe(response =>{
      this.productsListInt = response as ProductInterface[];
      console.log("PRODUCT INT GENERADO");
    }, error =>{
      alert("Error de lectura metodo GET de API products.json...");
    }) 

      return this.asyncService.getAll(this.productsApiUrl);
  }
*/

     

     /* public getProductsListObject(){//obtiene una lista de productos de tipo inerface
      console.log("inicio getProductsListObject()");
      this.getProductsApiUrl().subscribe(response =>{
        this.productsListInt = response as ProductInterface[];
        console.log("PRODUCT INT GENERADO");
      }, error =>{
        alert("Error de lectura metodo GET de API products.json...");
      });
      console.log("fin de this.getProductsApiUrl()");
      console.log(this.productsListInt);
      return this.productsListInterfaceToProductsListObject(this.productsListInt); 
      
    }  */
      /* private async loadProductsInterface():ProductInterface[]{//asigna this.productsListInt y this.productsObjectList, retorna this.productsObjectList
        this.productsListInt = await this.asyncService.getAll(this.productsApiUrl);
        return this.productsListInt; */
        /* let productListObject: Product[] = [];
       let productInt: ProductInterface = {
        idProduct: 0,
        brand: "",
        category: "",
        urlImage: "",
        description: "",
        price: 1,
        stock: 1,
        characteristics: "",
        model: ""
      } */
      
  
      
      
       
/*         await this.asyncService.getAll(this.productsApiUrl)
       .then(response =>{
          response.map(value => 
          {
            productInt.idProduct = value.idProduct;
            productInt.brand = value.brand;
            productInt.category = value.category;
            productInt.characteristics = value.characteristics;
            productInt.model = value.model;
            productInt.price = value.price;
            productInt.stock = value.stock;
            productInt.urlImage = value.urlImage;
            productInt.description = value.description;
            this.productsListInt.push(productInt);
          }
          );
          productListObject = this.productsListInterfaceToProductsListObject(this.productsListInt);
          this.productsObjectList = productListObject;
       })
       .catch();
        alert("Error de lectura metodo GET de API products.json...");

       return this.productsObjectList; */


      //}

/* public getProductsListInterface(): Promise<ProductInterface[]>{
 */  //let productsListInt: ProductInterface[] = [];
  
 
  
  /* response.map(value => 
      {
         productInt.idProduct = value.idProduct;
        productInt.brand = value.brand;
        productInt.category = value.category;
        productInt.characteristics = value.characteristics;
        productInt.model = value.model;
        productInt.price = value.price;
        productInt.stock = value.stock;
        productInt.urlImage = value.urlImage;
        productInt.description = value.description;

        productsListInt.push(productInt); 
        
      }) */
 /*     this.loadProductsInterface
  return productsListInt;
} */

/* getProductsListObject(): Product[]{
  return this.productsListInterfaceToProductsListObject(this.productsListInt); */
  /* let productListObject: Product[] = [];
  let productsListInt: ProductInterface[] = [];
  this.getAllProductsApi()
  .then(response =>{
    
    productsListInt = response;
    productListObject = this.productsListInterfaceToProductsListObject(productsListInt);
    this.productsObjectList = productListObject;
  
  })
  .catch(error =>{
    alert("Error en getProductsListObject()" + error);
  });

  return productListObject; */
//}
/* 
    productsInterfaceToProductObject(productInterface: ProductInterface): Product{
      let product = new Product();
      product.setIdProduct(productInterface.idProduct);
      product.setBrand(Brand[productInterface.brand as keyof typeof Brand]);
      product.setCategory(Category[productInterface.category as keyof typeof Category]);
      product.setCharacteristics(productInterface.characteristics);
      product.setDescription(productInterface.description);
      product.setImage(new Image(productInterface.urlImage));
      product.setModel(productInterface.model);
      product.setPrice(productInterface.price);
      product.setStock(productInterface.stock);

      return product;
    }

        
    productsListInterfaceToProductsListObject(productsListInt: ProductInterface[]): Product[]{
      let producListObject: Product[] = [];
      productsListInt.forEach(productInt =>{
        producListObject.push(this.productsInterfaceToProductObject(productInt));
      });

      return producListObject;

    }
    
    

   private productsResponseToProductsListInt(response: any): ProductInterface[]{
    let productsList: ProductInterface[] = [];
    let productInterface: ProductInterface = {
      idProduct: 0,
      brand: "",
      category: "",
      urlImage: "",
      description: "",
      price: 1,
      stock: 1,
      characteristics: "",
      model: ""
    }

    for(let i = 0; i < response.length; i++){

      productInterface.idProduct = response[i].idProduct;
      productInterface.brand =  response[i].brand;
      productInterface.category= response[i].category;
      productInterface.urlImage= response[i].UrlImage;
      productInterface.description= response[i].description;
      productInterface.price= response[i].price;
      productInterface.stock= response[i].stock;
      productInterface.characteristics= response[i].characteristics;
      productInterface.model= response[i].model;

      productsList.push(productInterface);

    }
    return productsList;
  }
  */
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


  public addProductApi(product: Product):Observable<ProductInterface>{

    return this.asyncService.add(this.productToInterface(product), this.productsApiUrl);
  
  }

 public addProductInterfaceApi(productInt: ProductInterface){
  return this.asyncService.add(productInt, this.productsApiUrl);
 }





  //////////////////////    GET BY ID     ////////////////////////////////////////////////////

getProductInterfaceById(id: number){
  return this.asyncService.getById(id, this.productsApiUrl + "/");
}

}