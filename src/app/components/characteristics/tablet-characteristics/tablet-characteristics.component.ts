import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';

@Component({
  selector: 'app-tablet-characteristics',
  templateUrl: './tablet-characteristics.component.html',
  styleUrl: './tablet-characteristics.component.css'
})
export class TabletCharacteristicsComponent {

  screenSizesList: string[] = ['7"', '8"', '9"', '10"', '10.5"', '11"', '12.4"', '12.9"', '13"', '14"'];
  ramList: string[] = ['2 GB', '3 GB', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB'];

  characteristicsFormGroup: FormGroup;
  characteristicsString: string = "";

  constructor(private productCharacteristicsService: ProductcCharacteristicsService){
  
  
    this.characteristicsFormGroup = new FormGroup({
      "screenSize": new FormControl('13"', [Validators.required]),
      "ram": new FormControl('4 GB"', [Validators.required])
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
