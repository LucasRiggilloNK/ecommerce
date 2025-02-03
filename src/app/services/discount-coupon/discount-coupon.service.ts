import { computed, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DiscountCoupon } from '../../interfaces/product/discount-coupon';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { count } from 'console';
import { ProductInterface2 } from '../../interfaces/product/product-interface2';

@Injectable({
  providedIn: 'root'
})
export class DiscountCouponService {

  private discountCouponsApi = 'http://localhost:3004/discountCoupons';

  constructor(private http: HttpClient) { }

  getAll():Observable<DiscountCoupon[]>{
    return this.http.get<DiscountCoupon[]>(this.discountCouponsApi);
  }

  updateDiscountCoupon(discountCoupon: DiscountCoupon): Observable<DiscountCoupon>{
      const httpOptions = {
        headers: new HttpHeaders({'content-Type': 'application/json'}),
      };
      const { id, ...discountCouponWithoutId } = discountCoupon;
      return this.http.put<DiscountCoupon>(this.discountCouponsApi + "/" + discountCoupon.id, discountCouponWithoutId, httpOptions);
    }


//Retorna el cupon q tengan el codigo y sea valido en fecha, sbno undefined
   getDiscountCouponByCode(discountCouponList: DiscountCoupon[], code: string){
    //return discountCouponList.filter(coupon => (coupon.code == code && new Date(coupon.endDate).getTime() >= Date.now()));
    return discountCouponList.find(coupon => (coupon.code == code && new Date(coupon.endDate).getTime() >= Date.now()));
  }

  applyDiscount(cartItems: ProductInterface2[], discountCoupon: DiscountCoupon){// aplica el descuento, el el envio gratis, retorna el subtotal del carrito con el descuento
    let subTotal = 0;
    let mount = discountCoupon.maxMount;
    //let discountVar = discountCoupon.discountPercentage/100
    if(discountCoupon != undefined){
      if(discountCoupon.categoryList.length != 0 && discountCoupon.brandList.length != 0){//Cupón por categoria y marca

        cartItems.forEach(item =>{//Cupón por categoria y marca
          if(discountCoupon.categoryList.find(category => category == item.category) != undefined && 
            discountCoupon.brandList.find(brand => brand == item.brand) != undefined){

              /* if(discountCoupon.discountPercentage != 0 && discountCoupon.maxMount != 0){//descuento con porcentaje y monto maximo
                let discount = item.price*item.quantity*discountVar;
                if(mount >= discount){
                  subTotal = subTotal + item.price*item.quantity - discount;
                  mount = mount - discount;
                }else{
                  subTotal = subTotal + item.price*item.quantity - mount;
                  mount = 0;
                }

              }else if(discountCoupon.discountPercentage != 0 && discountCoupon.maxMount == 0){//descuento con porcentaje, sin monto maximo
                subTotal = subTotal + item.price*item.quantity*discountVar;

              } */
              subTotal = this.calculateSubtotalByPorcentAndMount(discountCoupon, item, subTotal, mount);


           }else{
            subTotal = subTotal + item.price*item.quantity;
           }
      });



    }else if(discountCoupon.categoryList.length != 0 && discountCoupon.brandList.length == 0){//Cupón por categoria sola
      cartItems.forEach(item =>{
        if(discountCoupon.categoryList.find(category => category == item.category) != undefined){
          //subTotal = subTotal + item.price*item.quantity;

          /* if(discountCoupon.discountPercentage != 0 && discountCoupon.maxMount != 0){//descuento con porcentaje y monto maximo
            let discount = item.price*item.quantity*discountVar;
            if(mount >= discount){
              subTotal = subTotal + item.price*item.quantity - discount;
              mount = mount - discount;
            }else{
              subTotal = subTotal + item.price*item.quantity - mount;
              mount = 0;
            }

          }else if(discountCoupon.discountPercentage != 0 && discountCoupon.maxMount == 0){//descuento con porcentaje, sin monto maximo
            subTotal = subTotal + item.price*item.quantity*discountVar;

          } */


          subTotal = this.calculateSubtotalByPorcentAndMount(discountCoupon, item, subTotal, mount);
          
          


        }else{
          subTotal = subTotal + item.price*item.quantity;
         }
      });


      
    }else if(discountCoupon.categoryList.length == 0 && discountCoupon.brandList.length != 0){//Cupón por marca sola
      cartItems.forEach(item =>{
        if(discountCoupon.brandList.find(brand => brand == item.brand) != undefined){

          /* if(discountCoupon.discountPercentage != 0 && discountCoupon.maxMount != 0){//descuento con porcentaje y monto maximo
            let discount = item.price*item.quantity*discountVar;
            if(mount >= discount){
              subTotal = subTotal + item.price*item.quantity - discount;
              mount = mount - discount;
            }else{
              subTotal = subTotal + item.price*item.quantity - mount;
              mount = 0;
            }

          }else if(discountCoupon.discountPercentage != 0 && discountCoupon.maxMount == 0){//descuento con porcentaje, sin monto maximo
            subTotal = subTotal + item.price*item.quantity*discountVar;

          } */



          subTotal = this.calculateSubtotalByPorcentAndMount(discountCoupon, item, subTotal, mount);
        }else{
          subTotal = subTotal + item.price*item.quantity;
         }
      });
    }else{// cupón de descuento general
      cartItems.forEach(item =>{
        subTotal = this.calculateSubtotalByPorcentAndMount(discountCoupon, item, subTotal, mount); 
      });



    }
  }

  return subTotal;

}


  //Calcula el subtotal aplicando porcentaj y monto maximo o porcentaje solo según corresponda el cupon de descuento
  calculateSubtotalByPorcentAndMount(discountCoupon: DiscountCoupon, item: ProductInterface2, subTotal: number, mount: number){
    let discountVar = discountCoupon.discountPercentage/100;
    
    if(discountCoupon.discountPercentage != 0 && discountCoupon.maxMount != 0){//descuento con porcentaje y monto maximo
      let discount = item.price*item.quantity*discountVar;
      if(mount >= discount){
        subTotal = subTotal + item.price*item.quantity - discount;
        mount = mount - discount;
      }else{
        subTotal = subTotal + item.price*item.quantity - mount;
        mount = 0;
      }

    }else if(discountCoupon.discountPercentage != 0 && discountCoupon.maxMount == 0){//descuento con porcentaje, sin monto maximo
      subTotal = subTotal + item.price*item.quantity*discountVar;

    }
    return subTotal;
  }

  

}
