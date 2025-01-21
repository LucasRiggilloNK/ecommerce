import { Injectable } from '@angular/core';
import { producerAccessed } from '@angular/core/primitives/signals';
import { FormGroup } from '@angular/forms';
import { AirType } from '../../models/products/characteristics/air-conditioning/air-type';
import { HeatCold } from '../../models/products/characteristics/air-conditioning/heat-cold';
import { Color } from '../../models/products/characteristics/color';

@Injectable({
  providedIn: 'root'
})
export class ProductcCharacteristicsService {
  characteristicsString: string = "";
  ////// CARACTERITICAS GENERALES  /////
  private colorList = Object.values(Color).sort();

  ///// AIRE ACOINDICIONADO  //////
  private airTypeList: string[] = Object.values(AirType).sort();
  private heatColdList: string[] = Object.values(HeatCold);





  
  constructor() { }

  
    getCharacteristicsStringCategory(characteristicsFormGroup: FormGroup): string{// recibe el formGroup de caracteristicas de la categoria, arma el string y lo retorna
      let keys: string[] = [];
      let values: string[] = [];;
      let out = "";
  
      if(characteristicsFormGroup.valid){
        keys = Object.keys(characteristicsFormGroup.controls);
        values = Object.keys(keys).map(key => characteristicsFormGroup.get(key)?.value);
        for(let i = 0; i < keys.length; i++){
          out.concat(keys[i]);
          out.concat(",");
          out.concat(values[i+1]);
          if(i < keys.length-1){
            out.concat(",");
          }
        }
      }else{
        alert("Formgroup invalido");
      }

      return out;
    }

    getCharacteristicsString(): string{
      
      return this.characteristicsString;
      
    }

    obtainCharacteristicsString(characteristicsString: string){
      this.characteristicsString = characteristicsString;
      console.log("characteristicsString en OBTAIN: " + this.characteristicsString);

    }
    sendCharacteristicsString(){
      console.log("characteristicsString en SEND: " + this.characteristicsString);
      return this.characteristicsString;
    }


    //////////////////////   GETS CARACTERISTICAS   ////////////////////////////////
    public getColorList(){
      return this.colorList;
    }

    public getAirTypeList(){
      return this.airTypeList;
    }

    public getHeatColdList(){
      return this.heatColdList;
    }



}