import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';


@Component({
  selector: 'app-mouse-characteristics',
  templateUrl: './mouse-characteristics.component.html',
  styleUrl: './mouse-characteristics.component.css'
})
export class MouseCharacteristicsComponent {

  hasCable: string[] = ['Si', 'No'];
  isWireless: string[] = ['Si', 'No'];
  hasBluetooth: string[] = ['Sí', 'No'];

  characteristicsFormGroup: FormGroup;
  characteristicsString: string = "";

  constructor(private productCharacteristicsService: ProductcCharacteristicsService){
  
  
    this.characteristicsFormGroup = new FormGroup({
      "hasCable": new FormControl('No', [Validators.required]),
      "isWireless": new FormControl('No"', [Validators.required]),
      "hasBluetooth": new FormControl('No"', [Validators.required])
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
