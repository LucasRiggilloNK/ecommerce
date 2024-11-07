import { Injectable } from '@angular/core';
import { producerAccessed } from '@angular/core/primitives/signals';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProductcCharacteristicsService {
  characteristicsString: string = "";
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

}