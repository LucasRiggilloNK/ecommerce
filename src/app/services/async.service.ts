import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductInterface } from '../interfaces/product/product-interface';

@Injectable({
  providedIn: 'root'
})
export class AsyncService {

  constructor(private http: HttpClient) { }

  getAll(urlApi:string): Promise<any>{
    return this.http.get(urlApi).toPromise();
  }

  add(product: ProductInterface, urlApi: string): Promise<any>{
    const httpOptions = {
      headers: new HttpHeaders({"contentType":"appliction/json"})
    }
    return this.http.post(urlApi, product, httpOptions).toPromise();
  }
  getById(productId: number, urlApi: string):Promise<any>{
    return this.http.get(urlApi + productId).toPromise();
  }
}

