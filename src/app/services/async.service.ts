import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable, OnInit } from '@angular/core';
import { ProductInterface } from '../interfaces/product/product-interface';
import { lastValueFrom, Observable } from 'rxjs';
import { Product } from '../models/products/product';
import { ProductInterface2 } from '../interfaces/product/product-interface2';

@Injectable({
  providedIn: 'root',
})
export class AsyncService {
  constructor(private http: HttpClient) {}


  getAllPromise(urlApi: string): Promise<ProductInterface[] | undefined> {
    return this.http.get<ProductInterface[]>(urlApi).toPromise(); //lastValueFrom transforma el observable en promesa, ToPromise esta deprecado en versiones
  }


  add(product: ProductInterface,urlApi: string): Promise<ProductInterface | null> {
    const httpOptions = {
      headers: new HttpHeaders({'content-Type': 'application/json'}),
    };

    const { id, ...productWithoutId } = product;//producto sin id para q json server lo genere automaticamente

    return lastValueFrom(this.http.post<ProductInterface>(urlApi, productWithoutId, httpOptions));
  }

  getByIdPromise(productId: string, urlApi: string): Promise<ProductInterface> {
    return lastValueFrom(this.http.get<ProductInterface>(urlApi + "/" + productId));
  }

  updateProduct(productId: string, product: ProductInterface, urlApi: string): Observable<ProductInterface>{
    const httpOptions = {
      headers: new HttpHeaders({'content-Type': 'application/json'}),
    };
    const { id, ...productWithoutId } = product;
    return this.http.put<ProductInterface>(urlApi + "/" + productId, productWithoutId, httpOptions);
  }
  deleteProduct(id: string, urlApi: string): Observable<ProductInterface>{
    return this.http.delete<ProductInterface>(urlApi + "/" + id);
  }




  ///////////////////////  AGREGADO   //////////////////////////////////////////7
  
  getAll(urlApi: string): Observable<ProductInterface2[]> {
    return this.http.get<ProductInterface2[]>(urlApi); 
  }


  addProduct(product: ProductInterface2,urlApi: string): Observable<ProductInterface2> {
    const httpOptions = {
      headers: new HttpHeaders({'content-Type': 'application/json'}),
    };

    const { id, ...productWithoutId } = product;//producto sin id para q json server lo genere automaticamente

    return this.http.post<ProductInterface2>(urlApi, productWithoutId, httpOptions);
  }

  getProductById(productId: string, urlApi: string): Observable<ProductInterface2> {
    return this.http.get<ProductInterface2>(urlApi + "/" + productId);
  }


}
