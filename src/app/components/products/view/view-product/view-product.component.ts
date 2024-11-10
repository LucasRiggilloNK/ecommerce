import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { ProductInterface } from '../../../../interfaces/product/product-interface';
import { ProductService } from '../../../../services/product/product.service';
import { Product } from '../../../../models/products/product';
import { Brand } from '../../../../models/products/brands/brand';
import { Category } from '../../../../models/products/categories/category';
import { Image } from '../../../../models/products/images/image';
import { response } from 'express';
import { error } from 'console';
import { Observable, Subscription } from 'rxjs';
import { BADNAME } from 'dns';
import { CarritoService } from '../../../../services/cart.service';

import {
  AbstractFormGroupDirective,
  FormControl,
  FormGroup,
} from '@angular/forms';


@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css',
})
export class ViewProductComponent implements OnInit, OnDestroy {
  productsListInt: ProductInterface[] = [];

  productInterfaceById: ProductInterface | null = null;

  subscriptionGetProductListInterface: Subscription;
  subscriptionGetProductInterfaceById: Subscription;

  formControlById: FormControl;

  categoryList: string[] = Object.values(Category);
  brandList: string[] = [];

  productListFilteredByCategory: ProductInterface[] = [];
  productListSubFiltered: ProductInterface[] = [];
  formControlCategory: FormControl;
  formGrupSubfilters: FormGroup;

  valueChangesSubscription?: Subscription;
  valueChangesformGrupSubfiltersSubscription?: Subscription;
	
  airTypesList: string[] = ["Split", "Portatil", "Split inverter", "Ventana"];
   heatColdList = ['Si', 'No'];
   fanTypeList = ['Pie', 'Turbo'];
   tvTechnologiesList: string[] = ['LED', 'OLED', 'AMOLED', 'QLED', 'NanoCell', "FHD"];
   tvInchesList: string[] = ['32"', '43"', '55"', '60"', '70"', '75"'];
   headphonesTypeList = ['inEar', 'headBand'];
   refrigeratorCoolingSystemList: string[] =  ['No frost', 'Ciclico', 'Cycle defrost', 'Mono cooling', 'Skin condenser'];
   washingCapacityList: string[] = ['6 kg', "6.5 kg",'7 kg', '8 kg', '9 kg', '10 kg', '11 kg'];
   microwaveCapacityList: string[] = ['15 lts', '17 lts', '20 lts', '23 lts', '25 lts', '28 lts', '30 lts', '32 lts', '35 lts', '40 lts', '42 lts', '45 lts'];
   smartPhoneInchesList: string[] = ['4.0"', '4.7"', '5.0"', '5.5"', '5.8"', '6.1"', '6.3"', '6.5"', '6.6"', '6.7"', '6.8"', '7.0"'];
   smartPhoneRamList: string[] = ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB', '18 GB'];
   notebookScreenSizesList: string[] = [ '13"', '14"', '15"', '15.6"', '16"', '17"'];
   notebookRamList: string[] = ['4 GB', '8 GB', '12 GB', '16 GB', '32 GB', '64 GB'];
   notebookProcessorsList: string[] = ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Intel Pentium Gold'];
   notebookStorageSizesList: string[] = ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB', '8TB', '16TB', '32TB', '64TB'];
   tabletScreenSizesList: string[] = ['7"', '8"', '9"', '10"', '10.1"', '10.5"', '11"', '12.4"', '12.9"', '13"', '14"'];
   tabletRamList: string[] = ['2 GB', '3 GB', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB'];
   printerTypeList: string[] = ["Color", "Monocromática", "3D"];
   keyboardConnectivityTypeList: string[] = ["Cable","Wireless","Bluetooth"];
   mouseConnectivityTypeList: string[] = ["Cable","Wireless","Bluetooth"];




  constructor(
    private productService: ProductService,
    private carritoService: CarritoService,
  ) {
    this.subscriptionGetProductListInterface = new Subscription();
    this.subscriptionGetProductInterfaceById = new Subscription();
    this.formControlById = new FormControl();

    //Elimina el elemento none en categoryList
    let indiceNONE = this.categoryList.indexOf(Category.NONE);
    this.categoryList.splice(indiceNONE, 1);

    this.formControlCategory = new FormControl();
    this.formGrupSubfilters = new FormGroup({
      brand: new FormControl(Brand.NONE),
      // Aire acondicionado
      airTypes: new FormControl(''),
      heatCold: new FormControl(''),
      // Ventiladores
      fanType: new FormControl(''),
      // Televisores
      tvTecnology: new FormControl(''),
      tvInches: new FormControl(''),
      // Auriculares
      headphoneType: new FormControl(''),
      // Heladeras
      refrigeratorCoolingSystem: new FormControl(''),
      // Lavarropas
      washingCapacity: new FormControl(''),
      // Notebooks
      notebookScreenSize: new FormControl(''),
      notebookRam: new FormControl(''),
      notebookProcessor: new FormControl(''),
      notebookStorageSize: new FormControl(''),
      // Microondas
      microwaveCapacity: new FormControl(''),
      // Celulares
      smartphoneInches: new FormControl(''),
      smartphoneRam: new FormControl(''),
      // Tablets
      tabletScreenSize: new FormControl(''),
      tabletRam: new FormControl(''),
      // Impresoras
      printerType: new FormControl(''),
      // Teclado, mouse
      keyboardConnectivityType: new FormControl(''),
      mouseConnectivityType: new FormControl('')
      


    });

    /* this.airTypesListValues = this.productService.getCharacteristicsList('airTypes');
    this.heatColdList = this.productService.getCharacteristicsList('frioCalor'); */

  }

  ngOnInit(): void {
    this.getProductListInterface();
    this.valueChangesSubscription =
      this.formControlCategory.valueChanges.subscribe((form) => {
        this.getListFilteredByCategory(this.formControlCategory.value);
      });

    this.valueChangesformGrupSubfiltersSubscription =
      this.formGrupSubfilters.valueChanges.subscribe((form) => {
        this.getListFilteredBySubFilters(
          this.productListFilteredByCategory,
          this.formGrupSubfilters,
          this.formControlCategory.value
        );
      });

			
			
  }
  ngOnDestroy(): void {
    this.valueChangesSubscription?.unsubscribe();
    this.valueChangesformGrupSubfiltersSubscription?.unsubscribe();
  }

  async getProductListInterface() {
    this.productsListInt =
      await this.productService.getAllProductsListInterface();

    console.log('*');
  }



  async getProductInterfaceById(id: number) {
    // CON PROMISE
    this.productInterfaceById =
      await this.productService.getProductInterfaceById(id);
    if (this.productInterfaceById != null) {
      console.log('Producto encontrado: ');
      console.log(this.productInterfaceById);
    } else {
      console.log('Producto NO encontrado: ');
    }
  }

  buttonDetails(id: number) {
    this.getProductInterfaceById(id);
  }

  getFilterByCategory(
    productsListInt: ProductInterface[],
    category: string
  ): ProductInterface[] {
    //carga la lista filtrada por categoria
    return this.productService.filterByCategory(productsListInt, category);
  }

  async getAllProductsListInterface(): Promise<ProductInterface[]> {
    return await this.productService.getAllProductsListInterface();
  }



		async getListFilteredByCategory(category: string) {
		
			//Función que se ejecuta al hacer cambios en el select categoría
			let filteredProductsListInterface: ProductInterface[] = [];
	
			if (category != Category.NONE) {
				//none está cargado iniciamente en el formControl. Si está así, no muestra nada
	
				console.log('ATRODEN CATEGORY');
				//Filtrar por categoria
				this.productListFilteredByCategory =
					await this.getAllProductsListInterface(); // carga todos los productos en productListFilteredByCategory
	
				this.productListFilteredByCategory = this.getFilterByCategory(
					this.productListFilteredByCategory,
					category
				); //filtro categoria
				filteredProductsListInterface = this.productListFilteredByCategory; // la iguala a filteredProductsListInterface para poder filtrar desde ahi y no perder el punto de inicio de la categoria
	
				//limpiar todos los subfiltros
				this.valueChangesformGrupSubfiltersSubscription?.unsubscribe(); //desuscribo para poder cambiar los subfiltros y q no haya problemas de detección
	
				this.setInitialSubFiltersOfListProductsInterface(
					filteredProductsListInterface
				); //setea el estado inicial de lo subfiltros
	
				//Asignar lista a mostrar
				this.productListSubFiltered = filteredProductsListInterface; // está sin subfiltros aplicados pero es lo q tiene q mostrar inicialmente
	
				this.valueChangesformGrupSubfiltersSubscription =
					this.formGrupSubfilters.valueChanges.subscribe((form) => {
						this.getListFilteredBySubFilters(
							this.productListFilteredByCategory,
							this.formGrupSubfilters,
							this.formControlCategory.value
						);
					});
			}
		}









  private setInitialSubFiltersOfListProductsInterface(
    productsListInterface: ProductInterface[]
  ) {
    this.brandList = this.obtainBrandListFilteredByCategory(
      productsListInterface
    ); // obtiene las marcas de los productos filtrados
    this.formGrupSubfilters.get('brand')?.setValue(Brand.NONE);
    this.formGrupSubfilters.get('airTypes')?.setValue('');
    this.formGrupSubfilters.get('heatCold')?.setValue('');
    this.formGrupSubfilters.get('fanType')?.setValue('');
    this.formGrupSubfilters.get('tvTecnology')?.setValue('');
    this.formGrupSubfilters.get('tvInches')?.setValue('');
    this.formGrupSubfilters.get('headphoneType')?.setValue('');
    this.formGrupSubfilters.get('refrigeratorCoolingSystem')?.setValue('');
    this.formGrupSubfilters.get('washingCapacity')?.setValue('');
    this.formGrupSubfilters.get('notebookScreenSize')?.setValue('');
    this.formGrupSubfilters.get('notebookRam')?.setValue('');
    this.formGrupSubfilters.get('notebookProcessor')?.setValue('');
    this.formGrupSubfilters.get('notebookStorageSize')?.setValue('');
    this.formGrupSubfilters.get('microwaveCapacity')?.setValue('');
    this.formGrupSubfilters.get('smartphoneInches')?.setValue('');
    this.formGrupSubfilters.get('smartphoneRam')?.setValue('');
    this.formGrupSubfilters.get('tabletScreenSize')?.setValue('');
    this.formGrupSubfilters.get('tabletRam')?.setValue('');
    this.formGrupSubfilters.get('printerType')?.setValue('');
    this.formGrupSubfilters.get('keyboardConnectivityType')?.setValue('');
    this.formGrupSubfilters.get('mouseConnectivityType')?.setValue('');

  

    
    
  }

  obtainCharacteristicsArrayOfStringCharacteristics(
    stringCharacteristics: string
  ): string[] {
    return stringCharacteristics.split(',');
  }

  private async getListFilteredBySubFilters(
    productListSubFilteredByCategory: ProductInterface[],
    formGroup: FormGroup,
    category: string
  ) {
    let filteredProductsListInterface = productListSubFilteredByCategory;

    console.log('ATRODEN SUB FILTERS');
    //FILTRA POR MARCA
    if (formGroup.get('brand')?.value != Brand.NONE) {
      console.log('ATRODEN BRAND');
      filteredProductsListInterface = this.getListFilteredByBrand(
        filteredProductsListInterface,
        formGroup.get('brand')?.value
      );
    }

    // FILTRA POR CARACTERISTICAS DE CATEGORIA
    switch (category) {
      case 'Aire Acondicionado':
        if (formGroup.get('airTypes')?.value != '') {
          console.log('ATRODEN AA');
          //filteredProductsListInterface = this.getListFilteredByAirType(filteredProductsListInterface, formGroup.get("airTypes")?.value);
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'airTypes',
            formGroup.get('airTypes')?.value
          );
        }
        if (formGroup.get('heatCold')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'heatCold',
            formGroup.get('heatCold')?.value
          );
        }
        break;
      case 'Ventiladores':
        if (formGroup.get('fanType')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'fanType',
            formGroup.get('fanType')?.value
          );
        }
        break;
      case 'Televisores':
        if (formGroup.get('tvTecnology')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'tvTecnology',
            formGroup.get('tvTecnology')?.value
          );
        }
        if (formGroup.get('tvInches')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'tvInches',
            formGroup.get('tvInches')?.value
          );
        }
        break;
      case 'Auriculares':
        if (formGroup.get('headphoneType')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'headphoneType',
            formGroup.get('headphoneType')?.value
          );
        }
        break;
      case 'Parlantes':
        break;
      case 'Heladeras':
        if (formGroup.get('refrigeratorCoolingSystem')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'refrigeratorCoolingSystem',
            formGroup.get('refrigeratorCoolingSystem')?.value
          );
        }
        break;
      case 'Lavarropas':
        if (formGroup.get('washingCapacity')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'washingCapacity',
            formGroup.get('washingCapacity')?.value
          );
        }
        break;
      case 'Aspiradoras':
        break;
      case 'Microondas':
        if (formGroup.get('microwaveCapacity')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'microwaveCapacity',
            formGroup.get('microwaveCapacity')?.value
          );
        }
        break;
      case 'Tostadora':
        break;
      case 'Celulares':
        if (formGroup.get('smartphoneInches')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'smartphoneInches',
            formGroup.get('smartphoneInches')?.value
          );
        }
        if (formGroup.get('smartphoneRam')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'smartphoneRam',
            formGroup.get('smartphoneRam')?.value
          );
        }
        break;
      case 'Notebooks':
        if (formGroup.get('notebookScreenSize')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'notebookScreenSize',
            formGroup.get('notebookScreenSize')?.value
          );
        }
        if (formGroup.get('notebookRam')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'notebookRam',
            formGroup.get('notebookRam')?.value
          );
        }
        if (formGroup.get('notebookProcessor')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'notebookProcessor',
            formGroup.get('notebookProcessor')?.value
          );
        }
        if (formGroup.get('notebookStorageSize')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'notebookStorageSize',
            formGroup.get('notebookStorageSize')?.value
          );
        }
        break;
      case 'Tablets':
        if (formGroup.get('tabletScreenSize')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'tabletScreenSize',
            formGroup.get('tabletScreenSize')?.value
          );
        }
        if (formGroup.get('tabletRam')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'tabletRam',
            formGroup.get('tabletRam')?.value
          );
        }
        break;
      case 'Impresoras':
        if (formGroup.get('printerType')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'printerType',
            formGroup.get('printerType')?.value
          );
        }
        break;
      case 'Computadoras de Escritorio':
        break;
      case 'Teclados':
        if (formGroup.get('keyboardConnectivityType')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'keyboardConnectivityType',
            formGroup.get('keyboardConnectivityType')?.value
          );
        };
        
        break;
      case 'Mouses':
        if (formGroup.get('mouseConnectivityType')?.value != '') {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'mouseConnectivityType',
            formGroup.get('mouseConnectivityType')?.value
          );
        }
        
        break;
    }

    //Asignar lista a mostrar
    this.productListSubFiltered = filteredProductsListInterface;
  }

  private getListFilteredByBrand(
    productsListInterface: ProductInterface[],
    brand: string
  ): ProductInterface[] {
    return productsListInterface.filter((product) => product.brand == brand);
  }

  getListFilteredCharacteristics(productsListInterface: ProductInterface[], typeName: string, typeValue: string): ProductInterface[] {
    let producList: ProductInterface[] = [];
    productsListInterface.forEach((productinterface) => {
      let characteristics =
        this.obtainCharacteristicsArrayOfStringCharacteristics(
          productinterface.characteristics
        );
      if (characteristics[characteristics.indexOf(typeName) + 1] == typeValue) {
        console.log('*');
        console.log(productinterface);
        producList.push(productinterface);
      }
    });
    return producList;
  }

  /* getListFilteredByFrioCalor(productsListInterface: ProductInterface[], frioCalor: string): ProductInterface[]{
  let producList: ProductInterface[] = [];
  productsListInterface.forEach(productinterface =>{
    let characteristics = this.obtainCharacteristicsArrayOfStringCharacteristics(productinterface.characteristics);
    if(characteristics[characteristics.indexOf("frioCalor") + 1]  == frioCalor ){
      console.log("*");
      console.log(productinterface);
      producList.push(productinterface);
    }
  });
  return producList;
}
 */

  addToCart(product: ProductInterface): void {
    this.carritoService.addToCart(product);
  }

  obtainBrandListFilteredByCategory(productListInterface: ProductInterface[]) {//devuelve las marcas existentes en la lista por categoria
    let brandList: string[] = [];
    productListInterface.forEach((product) => {
      if (!brandList.includes(product.brand)) {
        brandList.push(product.brand);
      }
    });
    return brandList;
  }

  



	//////////////////////////////////////////   nav   /////////////////////////////////////////////////////
	getListFiltersByButtonNav(category:string){
		console.log("ATRODEN BUTTON");

		let filteredProductsListInterface = [];

		this.productListFilteredByCategory = this.getFilterByCategory(this.productListFilteredByCategory,category); //filtro categoria
		filteredProductsListInterface = this.productListFilteredByCategory; // la iguala a filteredProductsListInterface para poder filtrar desde ahi y no perder el punto de inicio de la categoria

		//limpiar todos los subfiltros
		this.valueChangesformGrupSubfiltersSubscription?.unsubscribe(); //desuscribo para poder cambiar los subfiltros y q no haya problemas de detección

		this.setInitialSubFiltersOfListProductsInterface(
			filteredProductsListInterface
		); //setea el estado inicial de lo subfiltros

		//Asignar lista a mostrar
		this.productListSubFiltered = filteredProductsListInterface; // está sin subfiltros aplicados pero es lo q tiene q mostrar inicialmente
		
		this.valueChangesformGrupSubfiltersSubscription =
      this.formGrupSubfilters.valueChanges.subscribe((form) => {
        this.getListFilteredBySubFilters(
          this.productListFilteredByCategory,
          this.formGrupSubfilters,
          this.formControlCategory.value
        );
      });

			console.log(this.productListSubFiltered);

	}
}
