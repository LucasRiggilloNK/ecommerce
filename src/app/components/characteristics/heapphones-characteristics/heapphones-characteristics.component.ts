import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';

@Component({
  selector: 'app-heapphones-characteristics',
  templateUrl: './heapphones-characteristics.component.html',
  styleUrl: './heapphones-characteristics.component.css',
})
export class HeapphonesCharacteristicsComponent {
  typeList = ['inEar', 'headBand'];
  characteristicsFormGroup: FormGroup;
  characteristicsString: string = '';

  constructor(
    private productCharacteristicsService: ProductcCharacteristicsService
  ) {
    this.characteristicsFormGroup = new FormGroup({
      tipoAuricular: new FormControl('inEar', [Validators.required]),
    });

    this.getCharacteristicsString(); //asigna por defecto el characteristicString
    console.log(
      'characteristicsString en CONSTRUCTOR AirConditioningCharacteristicsComponent'
    );
    console.log(this.characteristicsString);
  }

  ngOnInit(): void {
    this.characteristicsFormGroup.valueChanges.subscribe(
      //suscripción a los cambios del formulario
      (form) => {
        this.getCharacteristicsString(); //ejecuta la funcion q asigna el characteristicsString en cada cambio
      }
    );
  }

  getCharacteristicsString(): void {
    //carga el string de caracteriticas

    let keys: string[] = [];
    let values: string[] = [];
    let out = '';

    keys = Object.keys(this.characteristicsFormGroup.controls);
    values = Object.values(this.characteristicsFormGroup.value);

    for (let i = 0; i < keys.length; i++) {
      out = out + keys[i] + ',' + values[i];

      if (i < keys.length - 1) {
        out = out + ',';
      }
    }

    console.log('out: ' + out);

    this.characteristicsString = out;

    this.productCharacteristicsService.obtainCharacteristicsString(
      this.characteristicsString
    );
  }
}
