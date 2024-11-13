import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';

@Component({
  selector: 'app-microwave-characteristics',
  templateUrl: './microwave-characteristics.component.html',
  styleUrl: './microwave-characteristics.component.css'
})
export class MicrowaveCharacteristicsComponent {
  microwaveCapacityList: string[] = ["15 lts", "17 lts", "20 lts", "23 lts", "25 lts", "28 lts", "30 lts", "32 lts", "35 lts", "40 lts", "42 lts", "45 lts"];

  characteristicsFormGroup: FormGroup;
  characteristicsString: string = "";

  constructor(private productCharacteristicsService: ProductcCharacteristicsService){
  
  
    this.characteristicsFormGroup = new FormGroup({
      "microwaveCapacity": new FormControl(this.microwaveCapacityList[0], [Validators.required])
    });

    this.getCharacteristicsString();//asigna por defecto el characteristicString
    console.log("characteristicsString en CONSTRUCTOR MicrowaveCharacteristicsComponent");
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