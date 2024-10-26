import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoInteface } from '../interfaces/product/producto-inteface';

@Injectable({
  providedIn: 'root'
})
export class AsyncService {

  constructor(private http: HttpClient) { }

  getAll(urlApi:string): Promise<any>{
    return this.http.get(urlApi).toPromise();
  }

  add(product: ProductoInteface, urlApi: string): Promise<any>{
    const httpOptions = {
      headers: new HttpHeaders({"contentType":"appliction/json"})
    }
    return this.http.post(urlApi, product, httpOptions).toPromise();
  }
}

