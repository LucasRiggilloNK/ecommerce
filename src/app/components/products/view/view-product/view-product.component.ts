import {
  Component,
  CSP_NONCE,
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
import { AuthService } from '../../../../services/login/auth.service';
import {
  AbstractFormGroupDirective,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ProductInterface2 } from '../../../../interfaces/product/product-interface2';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css',
})
export class ViewProductComponent implements OnInit, OnDestroy {
  productsListInt: ProductInterface[] = [];
  filteredProducts: ProductInterface[] = [];
  productInterfaceById: ProductInterface | null = null;
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

  noProducts = false;


  ////////// AGREGADO  /////////////////////
  totalProductList: ProductInterface2[] = [];
  _productListFilteredByCategory: ProductInterface2[] = [];
  _productListSubFiltered: ProductInterface2[] = [];



  constructor(
    private productService: ProductService,
    private carritoService: CarritoService,
    private authService: AuthService
  ) {
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
    this.tvTechnologiesList = this.productService.getCharacteristicsList('tvTecnology');
    this.tvTechnologiesList.push("Todos");
    this.tvInchesList = this.productService.getCharacteristicsList('tvInches');
    this.tvInchesList.push("Todos");
    this.airTypesList = this.productService.getCharacteristicsList('airTypes');
    this.airTypesList.push("Todos");
    this.heatColdList = this.productService.getCharacteristicsList('heatCold');
    this.heatColdList.push("Todos");
    this.fanTypeList = this.productService.getCharacteristicsList('fanType');
    this.fanTypeList.push("Todos");
    this.headphonesTypeList =
      this.productService.getCharacteristicsList('headphoneType');
      this.headphonesTypeList.push("Todos");
    this.refrigeratorCoolingSystemList =
      this.productService.getCharacteristicsList('refrigeratorCoolingSystem');
      this.refrigeratorCoolingSystemList.push("Todos");
    this.washingCapacityList =
      this.productService.getCharacteristicsList('washingCapacity');
      this.washingCapacityList.push("Todos");
    this.microwaveCapacityList =
      this.productService.getCharacteristicsList('microwaveCapacity');
      this.microwaveCapacityList.push("Todos");
    this.smartphoneInchesList =
      this.productService.getCharacteristicsList('smartphoneInches');
      this.smartphoneInchesList.push("Todos");
    this.smartphoneRamList =
      this.productService.getCharacteristicsList('smartphoneRam');
      this.smartphoneRamList.push("Todos");
    this.notebookScreenSizesList =
      this.productService.getCharacteristicsList('notebookScreenSize');
      this.notebookScreenSizesList.push("Todos");
    this.notebookRamList =
      this.productService.getCharacteristicsList('notebookRam');
      this.notebookRamList.push("Todos");
    this.notebookProcessorsList =
      this.productService.getCharacteristicsList('notebookProcessor');
      this.notebookProcessorsList.push("Todos");
    this.notebookStorageSizesList = this.productService.getCharacteristicsList(
      'notebookStorageSize'
    );
    this.notebookStorageSizesList.push("Todos");
    this.tabletScreenSizesList =
      this.productService.getCharacteristicsList('tabletScreenSize');
      this.tabletScreenSizesList.push("Todos");
    this.tabletRamList =
      this.productService.getCharacteristicsList('tabletRam');
      this.tabletRamList.push("Todos");
    this.printerTypeList =
      this.productService.getCharacteristicsList('printerType');
      this.printerTypeList.push("Todos");
    this.keyboardConnectivityTypeList =
      this.productService.getCharacteristicsList('keyboardConnectivityType');
      this.keyboardConnectivityTypeList.push("Todos");
    this.mouseConnectivityTypeList = this.productService.getCharacteristicsList(
      'mouseConnectivityType'
    );
    this.mouseConnectivityTypeList.push("Todos");

    this.categoryList.splice(this.categoryList.indexOf(Category.NONE), 1);

  }

  ngOnInit(): void {
    
    
     this.noProducts = false;
     
    this.getTotalProduclist().subscribe({
      next: response =>{
        this.totalProductList = response;//Obtiene todos los productos y setea la totalProductList

        console.log(this.totalProductList);
        

        this.valueChangesSubscription =
        this.formControlCategory.valueChanges.subscribe((form) => {//suscribe a los cambios de valor de la categoría

          this.noProducts = false;// setea n falso el cartel de sin productos
          this._productListFilteredByCategory = this.getListFilteredByCategory(this.totalProductList, this.formControlCategory.value);

          console.log(this._productListFilteredByCategory);

          //limpiar todos los subfiltros
          this.valueChangesformGrupSubfiltersSubscription?.unsubscribe(); //desuscribo para poder cambiar los subfiltros y q no haya problemas de detección

          this.setInitialSubFiltersOfListProductsInterface(
            this._productListFilteredByCategory
          ); //setea el estado inicial de lo subfiltros
          
          //Asignar lista a mostrar
          this._productListSubFiltered = this._productListFilteredByCategory; // está sin subfiltros aplicados pero es lo q tiene q mostrar inicialmente
          

          this.valueChangesformGrupSubfiltersSubscription =
            this.formGrupSubfilters.valueChanges.subscribe((form) => {
              this._productListSubFiltered = this.getListFilteredBySubFilters(
                this._productListFilteredByCategory,
                this.formGrupSubfilters,
                this.formControlCategory.value
              );
            });

            if(this._productListSubFiltered.length == 0){
              this.noProducts = true;
            }

            console.log(this._productListSubFiltered);


      });

      this.formControlCategory.setValue(Category.ALL);// setea la categoria en todos para el inicio de página
      this._productListFilteredByCategory = this.getListFilteredByCategory(this.totalProductList, this.formControlCategory.value); //carga la lista para mostrar en el inicio e página

      },
      error: error =>{
        console.log("Error al obtener todos los productos...")
      }















    });


    
/*

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

      if(this.productService.getFormControlCategorySesion().value === ""){
        this.formControlCategory.setValue(Category.ALL);//seteo inicial de muestra de home 
      }else{
        
        this.formControlCategory.setValue(this.productService.getFormControlCategorySesion().value);
      }
      
       */


  }
  ngOnDestroy(): void {
   /*  this.valueChangesSubscription?.unsubscribe();
    this.valueChangesformGrupSubfiltersSubscription?.unsubscribe(); */
  }

/////////////////////////////////////// AGREGADO ////////////////////////////////////////////////////////

getTotalProduclist(){
  return this.productService.getAllProducts();
}


getListFilteredByCategory(totalProductList: ProductInterface2[], category: string) {//Función que se ejecuta al hacer cambios en el select categoría
  
  
  //let filteredProductsListInterface: ProductInterface2[] = [];
  let filteredProductsList: ProductInterface2[] = totalProductList;

  if (category != Category.NONE) {
    //none está cargado iniciamente en el formControl. Si está así, no muestra nada

      if(category != Category.ALL){
        filteredProductsList = this.getFilterByCategory(
          filteredProductsList,
          category
        ); //filtro categoria
      }
    
    //filteredProductsListInterface = this.productListFilteredByCategory; // la iguala a filteredProductsListInterface para poder filtrar desde ahi y no perder el punto de inicio de la categoria
    

    //limpiar todos los subfiltros
    /* this.valueChangesformGrupSubfiltersSubscription?.unsubscribe(); //desuscribo para poder cambiar los subfiltros y q no haya problemas de detección

    
    this.setInitialSubFiltersOfListProductsInterface(
      filteredProductsListInterface
    ); //setea el estado inicial de lo subfiltros
    

    

    //Asignar lista a mostrar
    this.productListSubFiltered = filteredProductsListInterface; // está sin subfiltros aplicados pero es lo q tiene q mostrar inicialmente
    if(this.productListSubFiltered.length == 0){
      this.noProducts = true;
    }

    this.valueChangesformGrupSubfiltersSubscription =
      this.formGrupSubfilters.valueChanges.subscribe((form) => {
        this.getListFilteredBySubFilters(
          this.productListFilteredByCategory,
          this.formGrupSubfilters,
          this.formControlCategory.value
        );
      });

    if (category == Category.ALL){
      this.productListSubFiltered = this.productListFilteredByCategory.slice(0, 48);
      if(this.formGrupSubfilters.get('brand')?.value === 'Todos'){
        this.productListSubFiltered = this.productListSubFiltered.slice(0, 48);
      }
      if(this.productListSubFiltered.length == 0){
        this.noProducts = true;
      }

    }
    this.productService.setFormControlCategorySesion(this.formControlCategory);//SEtea la categoría aplicada en la sesiónpara reutilizarla al volver atrás en alguna opción
     */
  }
  return filteredProductsList;
}

private getFilterByCategory(
  productsList: ProductInterface2[],
  category: string
): ProductInterface2[] {
  //retorna la lista filtrada por categoria
  return productsList.filter(
    (product) => product.category === category
  );
}

private setInitialSubFiltersOfListProductsInterface(
  productsList: ProductInterface2[]
) {
  this.brandList = this.obtainBrandListFilteredByCategory(
    productsList
  ); // obtiene las marcas de los productos filtrados
  this.formGrupSubfilters.get('brand')?.setValue("");
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

private obtainBrandListFilteredByCategory(productList: ProductInterface2[]) {
  //devuelve las marcas existentes en la lista por categoria
  let brandList: string[] = [];
  brandList.push(Brand.ALL);
  productList.forEach((product) => {
    if (!brandList.includes(product.brand)) {
      brandList.push(product.brand);
    }
  });
  return brandList;
}


private getListFilteredBySubFilters(
  productListSubFilteredByCategory: ProductInterface2[],
  formGroup: FormGroup,
  category: string
) {
  let filteredProductsListInterface = productListSubFilteredByCategory;
  this.noProducts = false;

  //FILTRA POR MARCA
  if (
    formGroup.get('brand')?.value != Brand.NONE &&
    formGroup.get('brand')?.value != Brand.ALL
  ) {
    filteredProductsListInterface = this.getListFilteredByBrand(
      filteredProductsListInterface,
      formGroup.get('brand')?.value
    );
  }
  
  /* // MUESTRA MAXIMO 48 PRODUCTOS CUANDO MUESTRA LA LISTA CON TODAS LAS CATEGORIAS 
  if(category == Category.ALL && formGroup.get('brand')?.value == Brand.ALL){
    filteredProductsListInterface = productListSubFilteredByCategory.slice(0, 48);
  } */

  // FILTRA ORDENADO POR PRECIO
  if (formGroup.get('orderByPrice')?.value != '') {
    filteredProductsListInterface = this.getListOrderedByPrice(filteredProductsListInterface,formGroup.get('orderByPrice')?.value).slice(0, 48);
  }

 /*  // FILTRA POR CARACTERISTICAS DE CATEGORIA
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
 */

  
  //Asignar lista a mostrar
  return filteredProductsListInterface;
  

  
}


private getListFilteredByBrand(// retorna una lista filtrada por marca
  productsList: ProductInterface2[],
  brand: string
): ProductInterface2[] {
  return productsList.filter((product) => product.brand == brand);
}

private getListOrderedByPrice(// retorna una lista ordenada por precio
  productList: ProductInterface2[],
  mode: 'asc' | 'desc'
): ProductInterface2[] {
  productList.sort((a, b) => {
    return mode === 'asc' ? a.price - b.price : b.price - a.price;
  });
  return productList;
}

private getListFilteredCharacteristics(
  productsList: ProductInterface2[],
  typeName: string,
  typeValue: string
): ProductInterface2[] {
  let producList: ProductInterface2[] = [];
  productsList.forEach((product) => {
    //HACER

    /* let characteristics =
      this.obtainCharacteristicsArrayOfStringCharacteristics(
        productinterface.characteristics
      );
    if (characteristics[characteristics.indexOf(typeName) + 1] == typeValue) {
      console.log('*');
      console.log(productinterface);
      producList.push(productinterface);
    } */
  });
  return producList;
}



//////////////////////////////////  DELETE   //////////////////////////////////
deleteProduct(){ // HACER

}

isAdmin(){ // HACER
  return true
}

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* async getProductListInterface() {
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
    this.noProducts = false;
    
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
      if(this.productListSubFiltered.length == 0){
        this.noProducts = true;
      }

      this.valueChangesformGrupSubfiltersSubscription =
        this.formGrupSubfilters.valueChanges.subscribe((form) => {
          this.getListFilteredBySubFilters(
            this.productListFilteredByCategory,
            this.formGrupSubfilters,
            this.formControlCategory.value
          );
        });

      if (category == Category.ALL){
        this.productListSubFiltered = this.productListFilteredByCategory.slice(0, 48);
        if(this.formGrupSubfilters.get('brand')?.value === 'Todos'){
          this.productListSubFiltered = this.productListSubFiltered.slice(0, 48);
        }
        if(this.productListSubFiltered.length == 0){
          this.noProducts = true;
        }

      }
      this.productService.setFormControlCategorySesion(this.formControlCategory);//SEtea la categoría aplicada en la sesiónpara reutilizarla al volver atrás en alguna opción
      
    }
  }

  private setInitialSubFiltersOfListProductsInterface(
    productsListInterface: ProductInterface[]
  ) {
    this.brandList = this.obtainBrandListFilteredByCategory(
      productsListInterface
    ); // obtiene las marcas de los productos filtrados
    this.formGrupSubfilters.get('brand')?.setValue("");
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
    this.noProducts = false;

    //FILTRA POR MARCA
    if (
      formGroup.get('brand')?.value != Brand.NONE &&
      formGroup.get('brand')?.value != Brand.ALL
    ) {
      filteredProductsListInterface = this.getListFilteredByBrand(
        filteredProductsListInterface,
        formGroup.get('brand')?.value
      );
    }
    
    // MUESTRA MAXIMO 48 PRODUCTOS CUANDO MUESTRA LA LISTA CON TODAS LAS CATEGORIAS 
    if(category == Category.ALL && formGroup.get('brand')?.value == Brand.ALL){
      filteredProductsListInterface = productListSubFilteredByCategory.slice(0, 48);
    }

    // FILTRA ORDENADO POR PRECIO
    if (formGroup.get('orderByPrice')?.value != '') {
      filteredProductsListInterface = this.getListOrderedByPrice(filteredProductsListInterface,formGroup.get('orderByPrice')?.value).slice(0, 48);
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
    if(this.productListSubFiltered.length == 0){
      this.noProducts = true;
    }

    
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
  
  isLoggedIN(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(){
    return this.authService.isAdmin();
  }

  deleteProduct(){
    alert("Generar metodo para eliminar");
  } */
}
