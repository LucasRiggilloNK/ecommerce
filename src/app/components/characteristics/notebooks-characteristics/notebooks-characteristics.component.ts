import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';

@Component({
  selector: 'app-notebooks-characteristics',
  templateUrl: './notebooks-characteristics.component.html',
  styleUrl: './notebooks-characteristics.component.css'
})
export class NotebooksCharacteristicsComponent {

  screenSizesList: string[] = ['13"', '14"', '15"', '15.6"', '16"', '17"'];
  ramList: string[] = ['4 GB', '8 GB', '12 GB', '16 GB', '32 GB', '64 GB'];
  processorsList: string[] = ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Intel Pentium Gold'];
  storageSizesList: string[] = ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB', '8TB', '16TB', '32TB', '64TB'];



  characteristicsFormGroup: FormGroup;
  characteristicsString: string = "";

  constructor(private productCharacteristicsService: ProductcCharacteristicsService){
  
  
    this.characteristicsFormGroup = new FormGroup({
      "screenSize": new FormControl('13"', [Validators.required]),
      "ram": new FormControl('4 GB"', [Validators.required]),
      "processor": new FormControl('Intel Core i3', [Validators.required]),
      "storageSize": new FormControl('128GB', [Validators.required])
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
