import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';

@Component({
  selector: 'app-smartphones-characteristics',
  templateUrl: './smartphones-characteristics.component.html',
  styleUrl: './smartphones-characteristics.component.css'
})
export class SmartphonesCharacteristicsComponent {
  inchesList: string[] = ['4.0"', '4.7"', '5.0"', '5.5"', '5.8"', '6.1"', '6.3"', '6.5"', '6.7"', '6.8"', '7.0"'];
  ramList: string[] = ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB', '18 GB'];


  characteristicsFormGroup: FormGroup;
  characteristicsString: string = "";

  constructor(private productCharacteristicsService: ProductcCharacteristicsService){
  
  
    this.characteristicsFormGroup = new FormGroup({
      "pulgadas": new FormControl('4.0"', [Validators.required]),
      "ram": new FormControl('4 GB"', [Validators.required])
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