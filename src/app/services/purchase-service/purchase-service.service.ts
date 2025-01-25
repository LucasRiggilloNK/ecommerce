import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase } from '../../models/purchases/purchase';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private apiUrl = 'http://localhost:3002/purchases';

  constructor(private http: HttpClient) {}

  agregarCompra(compra: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(this.apiUrl, compra);
  }
  obtenerComprasPorCliente(clienteId: string): Observable<Purchase[]> {
    const url = `${this.apiUrl}?clienteId=${clienteId}`;
    return this.http.get<Purchase[]>(url);
  }
  
}
