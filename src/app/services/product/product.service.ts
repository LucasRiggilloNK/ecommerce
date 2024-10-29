import { Injectable } from '@angular/core';
import { Product } from '../../models/products/product';
import { AsyncService } from '../async.service';
import { Brand } from '../../models/products/brands/brand';
import { Category } from '../../models/products/categories/category';
import { Image } from '../../models/products/images/image';
import { rootCertificates } from 'tls';
import { response } from 'express';
import { publicDecrypt } from 'crypto';
import { ProductInterface } from '../../interfaces/product/product-interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsApiUrl: string = "";
  private airesAcondicionadoApiUrl: string = "";
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
  private ventiladoresApiUrl: string = "";
  private ps5ApiUrl = "";
  protected producsList: Product[] = [];

  //private product: Product|null = null;
  private product: ProductInterface|null = null; //Para relacionar con los campos de modificar producto

  constructor(private asyncService: AsyncService) { 
    this.product = {
    idProduct: 0,
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


  getApiCategory(category: Category):string{//Retorna el strning de la API por categoría
    let salida = "";
    switch(category){
      case Category.NONE:
          salida = "";
          break;
        case Category.AIRE_ACONDICIONADO:
          salida = this.airesAcondicionadoApiUrl;
          break;
        case Category.VENTILADOR:
          salida =this.ventiladoresApiUrl;
          break;
        case Category.TELEVISORES: 
          salida =this.televisoresApiUrl;
          break;
        case Category.AURICULARES: 
          salida =this.auricularesApiUrl;
          break;
        case Category.PARLANTES:
          salida =this.parlantesApiUrl;
          break;
        case Category.HELADERAS:
          salida =this.heladerasApiUrl;
          break;
        case Category.LAVARROPAS:
          salida =this.lavarropasApiUrl;
          break;
        case Category.ASPIRADORAS:
          salida =this.aspiradorasApiUrl;
          break;
        case Category.MICROONDAS: 
          salida =this.microondasApiUrl;
          break;
        case Category.TOSTADORA:
          salida =this.tostadorasApiUrl;
          break;
        case Category.CELULARES:
          salida =this.celularesApiUrl;
          break;
        case Category.NOTEBOOKS:
          salida =this.notebooksApiUrl;
          break;
        case Category.TABLETS:
          salida =this.tabletsApiUrl;
          break;
        case Category.IMPRESORAS:
          salida =this.impresorasApiUrl;
          break;
        case Category.COMPUTADORAS_ESCRITORIO:
          salida =this.computadorasEscritorioApiUrl;
          break;
        case Category.TECLADOS:
          salida =this.tecladosApiUrl;
          break;
        case Category.MOUSES:
          salida =this.mousesApiUrl;
          break;
      
    }
    return salida;
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

  private productToInterface(product: Product): ProductInterface{
    let productInterface: ProductInterface = {
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
    return productInterface;
  }

 public async addProduct(product: Product){//agrega el producto al json
  await this.asyncService.add(this.productToInterface(product), this.getApiCategory(product.getCategory()))
  .then(response =>{
    alert("PRODUCTO GUARDADO CON EXITO...");
  })
  .catch(reason =>{
    alert("ERROR DE GUARDADO DE PRODUCTO EN API...");
  });
  }

}


  //////////////////////    GET BY ID     ////////////////////////////////////////////////////

/*   public async getProductById(id: number){//VER CATEGORIA DEL ID
    await this.asyncService.getById(id, ) 
  }*/