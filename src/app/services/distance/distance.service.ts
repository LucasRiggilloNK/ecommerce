import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DistanceMatrix } from '../../interfaces/distance/distance-matrix';

@Injectable({
  providedIn: 'root'
})
export class DistanceService {

  

  /* private origin_location_1:string = "Vucetich 2744, Mar del Plata, Buenos Aires, Argentina";
  private destination_location_1:string = "Vucetich 2844, Mar del Plata, Buenos Aires, Argentina"; */
  
  /* private url:string = "https://api.distancematrix.ai/maps/api/distancematrix/json?origins=" + 
  this.origin_location_1 + 
  "&destinations=" + this.destination_location_1 +"&key=" + this.your_access_token + ""; */

private access_token:string = "eCPTW8BeWajYjUI2QaNn1plUiMAQC1EGsxMSCAnrNfbjU8XYtIJ04Su7YDDEVGqG";
private citydeposit = "Mar del Plata";
private provinceDeposit = "Buenos Aires";
private countryDeposit = "Argentina";
private streetDeposit = "San Luis";
private numberStreetDeposit = "4124";
private addressDeposit:string = this.streetDeposit + " " + this.numberStreetDeposit + ", " +
                            this.citydeposit + ", " + this.provinceDeposit + ", " + this.countryDeposit;


distanceMatrixObject: DistanceMatrix;
calculatedDistance: number;
  

  constructor(private httpClient: HttpClient){
    this.distanceMatrixObject = {//inicia el objeto distanceMatrix
        "destination_addresses": [
            ""
        ],
        "origin_addresses": [
            ""
        ],
        "rows": [
            {
                "elements": [
                    {
                        "distance": {
                            "text": "",
                            "value": 0
                        },
                        "duration": {
                            "text": "",
                            "value": 0
                        },
                        "origin": "",
                        "destination": "",
                        "status": ""
                    }
                ]
            }
        ],
        "status": ""
    }
    
    this.calculatedDistance = 0;

  }



getApiDistanceMatrix(origen: string, destino:string):Promise<any>{//guarda los datos obtenidos de la api distance matrix en distanceMatrixObject y obtiene la distancia en calculatedDistance

    return this.httpClient.get(this.generateUrlDistance(origen, destino)).toPromise()
    .then(response =>{
        
        this.distanceMatrixObject = response as DistanceMatrix;
        console.log(this.distanceMatrixObject);
        //console.log("Distancia: " + this.distanceMatrixObject.rows[0].elements[0].distance.value);
        this.calculatedDistance = this.distanceMatrixObject.rows[0].elements[0].distance.value;
        console.log("Distancia: " + this.calculatedDistance);
        
    })
    .catch(error => {
        console.log("error");
        console.log(error);
    });
}

generateUrlDistance(origen: string, destino:string){//origen y destino en formato string de calle numero, ciudad, provincia, pais
   
    return "https://api.distancematrix.ai/maps/api/distancematrix/json?origins=" + 
            origen + 
            "&destinations=" + 
            destino +
            "&key=" + this.access_token;
}

getDepositAddress():string{
    return this.addressDeposit;
}

getDestinyAddress():string{// ver de donde trae la calle nro, ciudad, provincia y pais y armar la dirección de destino para retornar
    /* return this.formDistance.get("calle")?.value + " " + this.formDistance.get("numero")?.value + ", " + 
            this.citydeposit + ", " + this.provinceDeposit + ", " + this.countryDeposit + ""; */
            return "";
    
}
onSubmit(){// metodo q llama y calcula a partir de un formulario
    console.log("Onsubmit");
    console.log(this.getDepositAddress());
    console.log(this.getDestinyAddress());

    this.getApiDistanceMatrix(this.getDepositAddress(), this.getDestinyAddress());
}

}
