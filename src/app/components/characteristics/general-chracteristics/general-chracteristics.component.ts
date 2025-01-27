import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { constrainedMemory } from 'process';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Color } from '../../../models/products/characteristics/color';
import { Country } from '../../../models/products/characteristics/country';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import { WeightUnit } from '../../../models/products/characteristics/weight-unit';
import { Observable } from 'rxjs';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { Brand } from '../../../models/products/brands/brand';
import { Category } from '../../../models/products/categories/category';

@Component({
  selector: 'app-general-chracteristics',
  templateUrl: './general-chracteristics.component.html',
  styleUrl: './general-chracteristics.component.css',
})
export class GeneralChracteristicsComponent implements OnInit, OnChanges {
  @Output()
  generalCharacteristicsFormValid = new EventEmitter<boolean>();
  @Input()
  resetFormGroup: boolean = false; // input desde createComponent para reiniciar el formulario
  

  generalCharacteristicsFormGroup: FormGroup;
  weightUnitList: string[];

  colorList: string[];
  countryList: string[];

  /// PRODUCT EDIT  //////////////////////
  
  productoToEdit: ProductInterface2;
  id: string = "";
  //////////////////////

  constructor(
    private productCharacteristicsService: ProductcCharacteristicsService,
    private productService: ProductService, private route: ActivatedRoute
  ) {
    this.colorList = this.productCharacteristicsService.getColorList();
    this.countryList = this.productCharacteristicsService.getCountryList();
    this.weightUnitList =
      this.productCharacteristicsService.getWeightUnitList();

    this.generalCharacteristicsFormGroup = new FormGroup({
      country: new FormControl(Country.NONE, Validators.required),
      color: new FormControl(Color.NONE, Validators.required),
      height: new FormControl('', Validators.required),
      width: new FormControl('', Validators.required),
      depth: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      weightUnit: new FormControl(WeightUnit.GR, Validators.required),
    });


    /// PRODUCT EDIT  //////////////////////
    
    this.productoToEdit = this.productService.initProductInterface();/// carga un producto vacío para reemplazar y editar



  }

  ngOnInit(): void {
    

    /// PRODUCT EDIT  //////////////////////
    let id = this.route.snapshot.paramMap.get("id");
    if(id != null){
      this.id = id;
      this.getProductoToEdit(id).subscribe({//busdcar el producto si es para editar y extrae las carcteristicas y las cargar en el formulario
        next: response =>{
          this.productoToEdit = response;
          this.setFormGroupToEdit(this.productoToEdit);
          
        },
        error: error =>{
          console.log("Error al buscar producto a editar")
        }
      });
    }
////////////////////////

    this.productCharacteristicsService.generalCharacteristicsFormGroupToGeneralCharacteristics(
      this.generalCharacteristicsFormGroup
    );
    
    this.formValid();



    this.generalCharacteristicsFormGroup.valueChanges.subscribe(
      // por cada cambio en elñ fomulario setea las caracteristicas generales en el characteristicsService
      () => {
        this.productCharacteristicsService.generalCharacteristicsFormGroupToGeneralCharacteristics(
          this.generalCharacteristicsFormGroup
        );

        this.formValid();
      }
    );



  /* /// PRODUCT EDIT  //////////////////////
  this.setFormGroupToEditCharact(this.characteristicsToEdit);

  //////////////////////// */

    

    
  }

  ngOnChanges(changes: SimpleChanges): void {
    /// al haber cambios en resetFormGroup los detecta y resetea el formGroup
    if (
      changes['resetFormGroup'] &&
      changes['resetFormGroup'].currentValue == true
    ) {
      this.generalCharacteristicsFormGroup.reset({
        country: Country.NONE,
        color: Color.NONE,
        height: '',
        width: '',
        depth: '',
        weight: '',
        weightUnit: WeightUnit.GR,
      });
      
      
    }
  }

  formValid() {
    this.generalCharacteristicsFormValid.emit(
      this.generalCharacteristicsFormGroup.valid
    );
  }


  setFormGroupToEdit(product: ProductInterface2){//Setea el formGroup con los datos del producto a editar

      
    
      this.generalCharacteristicsFormGroup.get("country")?.setValue(product.characteristics.country);
      this.generalCharacteristicsFormGroup.get("color")?.setValue(product.characteristics.color);
      this.generalCharacteristicsFormGroup.get("height")?.setValue(product.characteristics.dimension.height.value);
      this.generalCharacteristicsFormGroup.get("width")?.setValue(product.characteristics.dimension.width.value);
      this.generalCharacteristicsFormGroup.get("depth")?.setValue(product.characteristics.dimension.depth.value);
      this.generalCharacteristicsFormGroup.get("weight")?.setValue(product.characteristics.weight.weight);
      this.generalCharacteristicsFormGroup.get("weightUnit")?.setValue(product.characteristics.weight.unit);
      console.log(" FORMGROUP TO EDIT")
      console.log(product);
  
    
    

   


  }

  


  getProductoToEdit(id: string):Observable<ProductInterface2>{
    console.log("ID: " + id);
    return this.productService._getProductById(id);






    
  }


}
