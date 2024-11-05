import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable, OnInit } from '@angular/core';
import { ProductInterface } from '../interfaces/product/product-interface';
import { lastValueFrom, Observable } from 'rxjs';
import { Product } from '../models/products/product';


@Injectable({
  providedIn: 'root'
})
export class AsyncService{

  constructor(private http: HttpClient) { }

  



   getAll(urlApi:string):Observable<ProductInterface[]>{
    return this.http.get<ProductInterface[]>(urlApi);
  } 

    getAllPromise(urlApi:string):Promise<ProductInterface[]>{
    return lastValueFrom(this.http.get<ProductInterface[]>(urlApi));//lastValueFrom transforma el observable en promesa, ToPromise esta deprecado en versiones
  }  

  /* add(product: ProductInterface, urlApi: string):Observable<ProductInterface>{
    const httpOptions = {
      headers: new HttpHeaders({"contentType":"application/json"})
    }
    return this.http.post<ProductInterface>(urlApi, product, httpOptions);
  } */

  add(product: ProductInterface, urlApi: string):Promise<ProductInterface>{
    const httpOptions = {
      headers: new HttpHeaders({"contentType":"application/json"})
    }
    return lastValueFrom(this.http.post<ProductInterface>(urlApi, product, httpOptions));
  }


/*   getById(productId: number, urlApi: string):Observable<ProductInterface>{
    return this.http.get<ProductInterface>(urlApi + productId);

} */


getByIdPromise(productId: number, urlApi: string):Promise<ProductInterface>{
  return lastValueFrom(this.http.get<ProductInterface>(urlApi + productId));

}
}