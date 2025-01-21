import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { AirType } from '../../../models/products/characteristics/air-conditioning/air-type';
import { HeatCold } from '../../../models/products/characteristics/air-conditioning/heat-cold';
import { AirConditioningCharacteristics } from '../../../interfaces/product/air-conditioning-characteristics';
import { Color } from '../../../models/products/characteristics/color';
import { GeneralCharacteristics } from '../../../interfaces/product/general-characteristics';


@Component({
  selector: 'app-air-conditioning-characteristics',
  templateUrl: './air-conditioning-characteristics.component.html',
  styleUrl: './air-conditioning-characteristics.component.css'
})
export class AirConditioningCharacteristicsComponent implements OnInit{
  /* airTypesList: string[] = ["Split", "Portatil", "Split inverter", "Ventana"]; */
  //airTypesList: string[] = Object.values(AirType).sort();
  /* heatColdList: string[] = ["Si", "No"]; */
  //heatColdList: string[]  = Object.values(HeatCold).sort();
  heatColdList: string[];
  airTypesList: string[];
  colorList : string[];

  characteristicsFormGroup: FormGroup;
  characteristicsString: string = "";

  constructor(private productCharacteristicsService: ProductcCharacteristicsService){
    
    this.colorList = this.productCharacteristicsService.getColorList();
    this.heatColdList = this.productCharacteristicsService.getHeatColdList();
    this.airTypesList = this.productCharacteristicsService.getAirTypeList();


  
    this.characteristicsFormGroup = new FormGroup({
      "heatCold": new FormControl(this.heatColdList[0], [Validators.required]),
      "airTypes": new FormControl(this.airTypesList[0], [Validators.required]),
      "color": new FormControl(this.colorList[0], [Validators.required]),
    });

    this.getCharacteristicsString();//asigna por defecto el characteristicString
    
    //console.log(this.characteristicsString);
  }

  ngOnInit(): void {

      

      this.characteristicsFormGroup.valueChanges.subscribe(//suscripción a los cambios del formulario
        form => {
          this.getCharacteristicsString();//ejecuta la funcion q asigna el characteristicsString en cada cambio
          this.setCharacteristicsInterface(this.characteristicsFormGroup);
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
    
    
    

    this.characteristicsString = out;
    
    this.productCharacteristicsService.obtainCharacteristicsString(this.characteristicsString);
    
    

  }

  setCharacteristicsInterface(form: FormGroup){
    
    let charact: AirConditioningCharacteristics = {
      airType: AirType.Split,
      heatCold: HeatCold.No,
      color: Color.BLACK
    };
    charact.airType = form.get("airTypes")?.value;
    charact.heatCold = form.get("heatCold")?.value;
    charact.color = form.get("color")?.value;

    console.log(charact);

  }

  
}
