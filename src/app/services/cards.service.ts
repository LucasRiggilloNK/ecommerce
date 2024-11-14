import { Injectable } from '@angular/core';
import { Card } from '../interfaces/cards/card';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private cardsApiUrl = 'http://localhost:3002/cards';

  constructor(private http: HttpClient) { 

  }

  getAllCardsPromise(urlApi: string): Promise<Card[] | undefined> {
      return this.http.get<Card[]>(urlApi).toPromise(); //lastValueFrom transforma el observable en promesa, ToPromise esta deprecado en versiones
  }

  existsCard(card: Card): boolean{
    let out: boolean = false;
    this.getAllCardsPromise(this.cardsApiUrl).then(response => {
    let cardList: Card[] | undefined = response;
     if (cardList?.find(crd => 
      crd.type === card.type &&
      crd.cardHolder === card.cardHolder &&
      crd.cardNumber === card.cardNumber &&
      crd.expirationDate === card.expirationDate &&
      crd.cvv === card.cvv &&
      crd.issuer === card.issuer
    )) {
        out =  true;
        alert('Tarjeta existente');
      }else{
        out = false;
        alert('Tarjeta inexistente');

      }
    }).catch( error => {
      console.log(error);
    })
    return out;
  }


}

