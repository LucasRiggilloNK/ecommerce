import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';

@Component({
  selector: 'app-air-conditioning-characteristics',
  templateUrl: './air-conditioning-characteristics.component.html',
  styleUrl: './air-conditioning-characteristics.component.css'
})
export class AirConditioningCharacteristicsComponent implements OnInit{
  airTypesList: string[] = ["Split", "Portatil", "Split inverter", "Ventana"];
  heatColdList: string[] = ["Si", "No"];
  characteristicsFormGroup: FormGroup;
  characteristicsString: string = "";

  constructor(private productCharacteristicsService: ProductcCharacteristicsService){
  
  
    this.characteristicsFormGroup = new FormGroup({
      "heatCold": new FormControl(this.heatColdList[0], [Validators.required]),
      "airTypes": new FormControl(this.airTypesList[0], [Validators.required])
    });

    this.getCharacteristicsString();//asigna por defecto el characteristicString
    
    console.log(this.characteristicsString);
  }

  ngOnInit(): void {
      this.characteristicsFormGroup.valueChanges.subscribe(//suscripción a los cambios del formulario
        form => {
          this.getCharacteristicsString();//ejecuta la funcion q asigna el characteristicsString en cada cambio
        }
      )
  }

  getCharacteristicsString():void{//carga el string de caracteriticas

    let keys: string[] = [];
    let values: string[] = [];;
    let out = "";
    

      keys = Object.keys(this.characteristicsFormGroup.controls);
      values = Object.values(this.characteristicsFormGroup.value);
  
      for(let i = 0; i < keys.length; i++){
        out = out + keys[i] + "," + values[i];
      
        if(i < keys.length-1){
          out = out + ",";
        }
      }
    
    
    console.log("out: " + out);

    this.characteristicsString = out;
    
    this.productCharacteristicsService.obtainCharacteristicsString(this.characteristicsString);
    
    

  }

  
}
