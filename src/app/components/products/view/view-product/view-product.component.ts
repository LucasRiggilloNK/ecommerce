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
  filteredProducts: ProductInterface[] = [];
  productInterfaceById: ProductInterface | null = null;
  //subscriptionGetProductListInterface: Subscription;
  subscriptionGetProductInterfaceById: Subscription;
  formControlById: FormControl;
  categoryList: string[] = Object.values(Category).sort();
  brandList: string[] = [];
  searchTerm: string = '';
  productListFilteredByCategory: ProductInterface[] = [];
  productListSubFiltered: ProductInterface[] = [];
  formControlCategory: FormControl;
  formGrupSubfilters: FormGroup;

  valueChangesSubscription?: Subscription;
  valueChangesformGrupSubfiltersSubscription?: Subscription;

  tvTechnologiesList: string[];
  tvInchesList: string[];
  airTypesList: string[];
  heatColdList: string[];
  fanTypeList: string[];
  headphonesTypeList: string[];
  refrigeratorCoolingSystemList: string[];
  washingCapacityList: string[];
  microwaveCapacityList: string[];
  smartphoneInchesList: string[];
  smartphoneRamList: string[];
  notebookScreenSizesList: string[];
  notebookRamList: string[];
  notebookProcessorsList: string[];
  notebookStorageSizesList: string[];
  tabletScreenSizesList: string[];
  tabletRamList: string[];
  printerTypeList: string[];
  keyboardConnectivityTypeList: string[];
  mouseConnectivityTypeList: string[];

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService
  ) {
    //this.subscriptionGetProductListInterface = new Subscription();
    this.subscriptionGetProductInterfaceById = new Subscription();
    this.formControlById = new FormControl();

    

    this.formControlCategory = new FormControl();
    this.formGrupSubfilters = new FormGroup({
      brand: new FormControl(""),
      orderByPrice: new FormControl(''),
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
      mouseConnectivityType: new FormControl(''),
    });
    this.tvTechnologiesList =
      this.productService.getCharacteristicsList('tvTecnology');
    this.tvInchesList = this.productService.getCharacteristicsList('tvInches');
    this.airTypesList = this.productService.getCharacteristicsList('airTypes');
    this.heatColdList = this.productService.getCharacteristicsList('heatCold');
    this.fanTypeList = this.productService.getCharacteristicsList('fanType');
    this.headphonesTypeList =
      this.productService.getCharacteristicsList('headphoneType');
    this.refrigeratorCoolingSystemList =
      this.productService.getCharacteristicsList('refrigeratorCoolingSystem');
    this.washingCapacityList =
      this.productService.getCharacteristicsList('washingCapacity');
    this.microwaveCapacityList =
      this.productService.getCharacteristicsList('microwaveCapacity');
    this.smartphoneInchesList =
      this.productService.getCharacteristicsList('smartphoneInches');
    this.smartphoneRamList =
      this.productService.getCharacteristicsList('smartphoneRam');
    this.notebookScreenSizesList =
      this.productService.getCharacteristicsList('notebookScreenSize');
    this.notebookRamList =
      this.productService.getCharacteristicsList('notebookRam');
    this.notebookProcessorsList =
      this.productService.getCharacteristicsList('notebookProcessor');
    this.notebookStorageSizesList = this.productService.getCharacteristicsList(
      'notebookStorageSize'
    );
    this.tabletScreenSizesList =
      this.productService.getCharacteristicsList('tabletScreenSize');
    this.tabletRamList =
      this.productService.getCharacteristicsList('tabletRam');
    this.printerTypeList =
      this.productService.getCharacteristicsList('printerType');
    this.keyboardConnectivityTypeList =
      this.productService.getCharacteristicsList('keyboardConnectivityType');
    this.mouseConnectivityTypeList = this.productService.getCharacteristicsList(
      'mouseConnectivityType'
    );
  }

  ngOnInit(): void {
    //Elimina el elemento none en categoryList
    let indiceNONE = this.categoryList.indexOf(Category.NONE);
    this.categoryList.splice(indiceNONE, 1);



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

      this.formControlCategory.setValue(Category.ALL);//seteo inicial de muestra de home 
  }
  ngOnDestroy(): void {
    this.valueChangesSubscription?.unsubscribe();
    this.valueChangesformGrupSubfiltersSubscription?.unsubscribe();
  }

  async getProductListInterface() {
    this.productsListInt =
      await this.productService.getAllProductsListInterface();
  }

  async getProductInterfaceById(id: string) {
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

  /* buttonDetails(id: number) {
    this.getProductInterfaceById(id);
  } */

  getFilterByCategory(
    productsListInt: ProductInterface[],
    category: string
  ): ProductInterface[] {
    //retorna la lista filtrada por categoria
    return this.productService.filterByCategory(productsListInt, category);
  }

  async getAllProductsListInterface(): Promise<ProductInterface[]> {
    return await this.productService.getAllProductsListInterface();
  }

  async getListFilteredByCategory(category: string) {//Función que se ejecuta al hacer cambios en el select categoría

    
    let filteredProductsListInterface: ProductInterface[] = [];

    if (category != Category.NONE) {
      //none está cargado iniciamente en el formControl. Si está así, no muestra nada

      //Filtrar por categoria
      this.productListFilteredByCategory =
        await this.getAllProductsListInterface(); // carga todos los productos en productListFilteredByCategory

        if(category != Category.ALL){
          this.productListFilteredByCategory = this.getFilterByCategory(
            this.productListFilteredByCategory,
            category
          ); //filtro categoria
        }
      
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
    this.formGrupSubfilters.get('orderByPrice')?.setValue('');
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
    if (
      formGroup.get('brand')?.value != Brand.NONE &&
      formGroup.get('brand')?.value != Brand.ALL
    ) {
      console.log('ATRODEN BRAND');
      filteredProductsListInterface = this.getListFilteredByBrand(
        filteredProductsListInterface,
        formGroup.get('brand')?.value
      );
    }

    // FILTRA ORDENADO POR PRECIO
    if (formGroup.get('orderByPrice')?.value != '') {
      console.log('ATRODEN ORDERBYPRICE');
      filteredProductsListInterface = this.getListOrderedByPrice(
        filteredProductsListInterface,
        formGroup.get('orderByPrice')?.value
      );
    }

    // FILTRA POR CARACTERISTICAS DE CATEGORIA
    switch (category) {
      case 'Aire Acondicionado':
        if (
          formGroup.get('airTypes')?.value != '' &&
          formGroup.get('airTypes')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'airTypes',
            formGroup.get('airTypes')?.value
          );
        }
        if (
          formGroup.get('heatCold')?.value != '' &&
          formGroup.get('heatCold')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'heatCold',
            formGroup.get('heatCold')?.value
          );
        }
        break;
      case 'Ventiladores':
        if (
          formGroup.get('fanType')?.value != '' &&
          formGroup.get('fanType')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'fanType',
            formGroup.get('fanType')?.value
          );
        }
        break;
      case 'Televisores':
        if (
          formGroup.get('tvTecnology')?.value != '' &&
          formGroup.get('tvTecnology')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'tvTecnology',
            formGroup.get('tvTecnology')?.value
          );
        }
        if (
          formGroup.get('tvInches')?.value != '' &&
          formGroup.get('tvInches')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'tvInches',
            formGroup.get('tvInches')?.value
          );
        }
        break;
      case 'Auriculares':
        if (
          formGroup.get('headphoneType')?.value != '' &&
          formGroup.get('headphoneType')?.value != 'Todos'
        ) {
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
        if (
          formGroup.get('refrigeratorCoolingSystem')?.value != '' &&
          formGroup.get('refrigeratorCoolingSystem')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'refrigeratorCoolingSystem',
            formGroup.get('refrigeratorCoolingSystem')?.value
          );
        }
        break;
      case 'Lavarropas':
        if (
          formGroup.get('washingCapacity')?.value != '' &&
          formGroup.get('washingCapacity')?.value != 'Todos'
        ) {
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
        if (
          formGroup.get('microwaveCapacity')?.value != '' &&
          formGroup.get('microwaveCapacity')?.value != 'Todos'
        ) {
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
        if (
          formGroup.get('smartphoneInches')?.value != '' &&
          formGroup.get('smartphoneInches')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'smartphoneInches',
            formGroup.get('smartphoneInches')?.value
          );
        }
        if (
          formGroup.get('smartphoneRam')?.value != '' &&
          formGroup.get('smartphoneRam')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'smartphoneRam',
            formGroup.get('smartphoneRam')?.value
          );
        }
        break;
      case 'Notebooks':
        if (
          formGroup.get('notebookScreenSize')?.value != '' &&
          formGroup.get('notebookScreenSize')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'notebookScreenSize',
            formGroup.get('notebookScreenSize')?.value
          );
        }
        if (
          formGroup.get('notebookRam')?.value != '' &&
          formGroup.get('notebookRam')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'notebookRam',
            formGroup.get('notebookRam')?.value
          );
        }
        if (
          formGroup.get('notebookProcessor')?.value != '' &&
          formGroup.get('notebookProcessor')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'notebookProcessor',
            formGroup.get('notebookProcessor')?.value
          );
        }
        if (
          formGroup.get('notebookStorageSize')?.value != '' &&
          formGroup.get('notebookStorageSize')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'notebookStorageSize',
            formGroup.get('notebookStorageSize')?.value
          );
        }
        break;
      case 'Tablets':
        if (
          formGroup.get('tabletScreenSize')?.value != '' &&
          formGroup.get('tabletScreenSize')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'tabletScreenSize',
            formGroup.get('tabletScreenSize')?.value
          );
        }
        if (
          formGroup.get('tabletRam')?.value != '' &&
          formGroup.get('tabletRam')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'tabletRam',
            formGroup.get('tabletRam')?.value
          );
        }
        break;
      case 'Impresoras':
        if (
          formGroup.get('printerType')?.value != '' &&
          formGroup.get('printerType')?.value != 'Todos'
        ) {
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
        if (
          formGroup.get('keyboardConnectivityType')?.value != '' &&
          formGroup.get('keyboardConnectivityType')?.value != 'Todos'
        ) {
          filteredProductsListInterface = this.getListFilteredCharacteristics(
            filteredProductsListInterface,
            'keyboardConnectivityType',
            formGroup.get('keyboardConnectivityType')?.value
          );
        }

        break;
      case 'Mouses':
        if (
          formGroup.get('mouseConnectivityType')?.value != '' &&
          formGroup.get('mouseConnectivityType')?.value != 'Todos'
        ) {
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

  private getListOrderedByPrice(
    productListInterface: ProductInterface[],
    mode: 'asc' | 'desc'
  ): ProductInterface[] {
    productListInterface.sort((a, b) => {
      return mode === 'asc' ? a.price - b.price : b.price - a.price;
    });
    return productListInterface;
  }

  getListFilteredCharacteristics(
    productsListInterface: ProductInterface[],
    typeName: string,
    typeValue: string
  ): ProductInterface[] {
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

  decreaseQuantity(productId: string) {
    this.carritoService.decreaseQuantity(productId);
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.productListSubFiltered.filter(
      (product) =>
        product.model.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
  }

  obtainBrandListFilteredByCategory(productListInterface: ProductInterface[]) {
    //devuelve las marcas existentes en la lista por categoria
    let brandList: string[] = [];
    brandList.push(Brand.ALL);
    productListInterface.forEach((product) => {
      if (!brandList.includes(product.brand)) {
        brandList.push(product.brand);
      }
    });
    return brandList;
  }

  //////////////////////////////////////////   nav   /////////////////////////////////////////////////////
  getListFiltersByButtonNav(category: string) {
    let filteredProductsListInterface = [];

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

    console.log(this.productListSubFiltered);
  }

  //////////////////////////////////   DETAILS    ///////////////////////////////////////////////////////////

  /*   sendProductIdToViewDetails(id: number){
   
    this.productService.setProductToViewDetailsById(id);
    
  } */
}
