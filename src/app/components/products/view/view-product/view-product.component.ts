import { Component, ElementRef, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { ProductInterface } from '../../../../interfaces/product/product-interface';
import { ProductService } from '../../../../services/product/product.service';
import { Product } from '../../../../models/products/product';
import { Brand } from '../../../../models/products/brands/brand';
import { Category } from '../../../../models/products/categories/category';
import { Image } from '../../../../models/products/images/image';
import { AbstractFormGroupDirective, FormControl, FormGroup } from '@angular/forms';
import { response } from 'express';
import { error } from 'console';
import { Observable, Subscription } from 'rxjs';
import { BADNAME } from 'dns';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent implements OnInit, OnDestroy {
  productsListInt: ProductInterface[] = [];
  productInterfaceById: ProductInterface|null = null;

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
  
  characteristicsList: string[] = [];

  airTypesListValues: string[] = ["split", "portatil", "split inverter", "ventana"];
  fanTypeListvalues = ["Pie", "Turbo"];

  tvTechnologiesList: string[] = ["LED", "OLED", "AMOLED", "QLED", "NanoCell"];
  tvInchesList: string[] = ['32"', '43"', '55"', '60"', '70"', '75"'];

  headphonesTypeListvalues = ["inEar","headBand"];

  coolingSystemList: string[] = ['no frost', 'ciclico', 'cycle defrost', 'cilcico', 'cycle desfrost', 'mono cooling', 'skin condenser'];

  washingCapacityList: string[] = ['6 kg', '7 kg', '8 kg', '9 kg', '10 kg', '11 kg'];

  microwaveCapacityList: string[] = ["15 lts", "17 lts", "20 lts", "23 lts", "25 lts", "28 lts", "30 lts", "32 lts", "35 lts", "40 lts", "42 lts", "45 lts"];

  smartPhoneInchesList: string[] = ['4.0"', '4.7"', '5.0"', '5.5"', '5.8"', '6.1"', '6.3"', '6.5"', '6.7"', '6.8"', '7.0"'];
  smartPhoneRamList: string[] = ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB', '18 GB'];

  notebookScreenSizesList: string[] = ['13"', '14"', '15"', '15.6"', '16"', '17"'];
  notebookRamList: string[] = ['4 GB', '8 GB', '12 GB', '16 GB', '32 GB', '64 GB'];
  notebookProcessorsList: string[] = ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Intel Pentium Gold'];
  notebookStorageSizesList: string[] = ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB', '8TB', '16TB', '32TB', '64TB'];

  tabletScreenSizesList: string[] = ['7"', '8"', '9"', '10"', '10.5"', '11"', '12.4"', '12.9"', '13"', '14"'];
  tabletRamList: string[] = ['2 GB', '3 GB', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB'];

  isMonochromatic: string[] = ['Si', 'No'];
  is3DPrinter: string[] = ['Sí', 'No'];


  constructor(private productService: ProductService) {

    this.subscriptionGetProductListInterface = new Subscription();
    this.subscriptionGetProductInterfaceById = new Subscription();
    this.formControlById = new FormControl();

    //Elimina el elemento none en categoryList
    let indiceNONE = this.categoryList.indexOf(Category.NONE)
    this.categoryList.splice(indiceNONE, 1);

    this.formControlCategory = new FormControl();
    this.formGrupSubfilters = new FormGroup({
      "brand": new FormControl(Brand.NONE),
      // Aire acondicionado
      "airTypes": new FormControl(""),
      "frioCalor": new FormControl(""),
      // Ventiladores
      "tipoVentiladores": new FormControl(""),
      // Televisores
      "tecnologia": new FormControl(""),
      "pulgadas": new FormControl(""),
      // Auriculares
      "tipoAuricular": new FormControl(""),
      // Heladeras
      "sistEnfriamiento": new FormControl(""),
      // Lavarropas
      "capacidadLavado": new FormControl(""),
      // Notebooks
      "screenSize": new FormControl(""),
      "ram": new FormControl(""),
      "processor": new FormControl(""),
      "storageSize": new FormControl(""),
      // Microondas
      "capacidad": new FormControl(""),
      // Celulares
      "pulgadasCelular": new FormControl(""),
      "ramCelular": new FormControl(""),
      // Tablets
      "screenSizeTablet": new FormControl(""),
      "ramTablet": new FormControl(""),
      // Impresoras
      "monochromatic": new FormControl(""),
      "is3DPrinter": new FormControl(""),
      // Teclado
      "hasCableKeyboard": new FormControl(""),
      "isWirelessKeyboard": new FormControl(""),
      "hasBluetoothKeyboard": new FormControl(""),
      // Mouse
      "hasCableMouse": new FormControl(""),
      "isWirelessMouse": new FormControl(""),
      "hasBluetoothMouse": new FormControl("")
    }
     
    );
  }
 

ngOnInit(): void {
  this.getProductListInterface();
  this.valueChangesSubscription = this.formControlCategory.valueChanges.subscribe(
    form =>{
      this.getListFilteredByCategory(this.formControlCategory);
    }
    
  );  

  this.valueChangesformGrupSubfiltersSubscription = this.formGrupSubfilters.valueChanges.subscribe(
    form =>{
      this.getListFilteredBySubFilters(this.productListFilteredByCategory, this.formGrupSubfilters, this.formControlCategory.value);
    }
  );

}
  ngOnDestroy(): void {
    this.valueChangesSubscription?.unsubscribe();
    this.valueChangesformGrupSubfiltersSubscription?.unsubscribe();
  }


  

  
      async getProductListInterface(){
    
        this.productsListInt = await this.productService.getAllProductsListInterface();
      
      console.log("*");
      console.log(this.productsListInt);
      
    } 


    /* async getProductListInterface(){FUNCIONA
    
      this.subscriptionGetProductListInterface = await this.productService.getProductsListInterfaceObservable().subscribe(
      response =>{
        this.productsListInt = response;
      }, error =>{
        alert("Error de lectura metodo GET de API products.json...");
      }
    ); 
    
    console.log("*");
    console.log(this.productsListInt);
    
  } */

  /* getProductInterfaceById(id: number){CON OBSERVABLE
    //let id = this.formControlById.getRawValue();
    this.subscriptionGetProductInterfaceById = this.productService.getProductInterfaceById(id).subscribe(

    response => {
      this.productInterfaceById = response;
      console.log("Producto encontrado: ");
      console.log(this.productInterfaceById);
    }, 
    error => {
      alert("Error: no se encontró el producto por id..." + error);
    }
  )
} */


async getProductInterfaceById(id: number){// CON PROMISE
  this.productInterfaceById = await this.productService.getProductInterfaceById(id);
  if(this.productInterfaceById != null){
    console.log("Producto encontrado: ");
    console.log(this.productInterfaceById);
  }else{
    console.log("Producto NO encontrado: ");
  }
  
  
}


buttonDetails(id: number){
  this.getProductInterfaceById(id);
  
}

getFilterByCategory(productsListInt: ProductInterface[], category: string): ProductInterface[]{//carga la lista filtrada por categoria
  return this.productService.filterByCategory(productsListInt, category);
}


async getAllProductsListInterface(): Promise<ProductInterface[]>{
  return await this.productService.getAllProductsListInterface();
}

async getListFilteredByCategory(formControlCategory: FormControl){//Función que se ejecuta al hacer cambios en el select categoría
  let filteredProductsListInterface: ProductInterface[] = [];
  
  if(formControlCategory.value != Category.NONE){//none está cargado iniciamente en el formControl. Si está así, no muestra nada
    
    console.log("ATRODEN CATEGORY");
    //Filtrar por categoria
    this.productListFilteredByCategory = await this.getAllProductsListInterface();// carga todos los productos en productListFilteredByCategory
    
    this.productListFilteredByCategory = this.getFilterByCategory(this.productListFilteredByCategory, formControlCategory.value);//filtro categoria
    filteredProductsListInterface = this.productListFilteredByCategory;// la iguala a filteredProductsListInterface para poder filtrar desde ahi y no perder el punto de inicio de la categoria


    //limpiar todos los subfiltros
    this.valueChangesformGrupSubfiltersSubscription?.unsubscribe();//desuscribo para poder cambiar los subfiltros y q no haya problemas de detección

    this.setInitialSubFiltersOfListProductsInterface(filteredProductsListInterface);//setea el estado inicial de lo subfiltros
    
    //Asignar lista a mostrar
    this.productListSubFiltered = filteredProductsListInterface;// está sin subfiltros aplicados pero es lo q tiene q mostrar inicialmente

    this.valueChangesformGrupSubfiltersSubscription = this.formGrupSubfilters.valueChanges.subscribe(
      form =>{
        this.getListFilteredBySubFilters(this.productListFilteredByCategory, this.formGrupSubfilters,formControlCategory.value);
      }
    );

  }

}


private setInitialSubFiltersOfListProductsInterface(productsListInterface: ProductInterface[]){
  
  this.brandList = this.obtainBrandListFilteredByCategory(productsListInterface);// obtiene las marcas de los productos filtrados
  this.formGrupSubfilters.get("brand")?.setValue(Brand.NONE);
  this.formGrupSubfilters.get("airTypes")?.setValue("");
  this.formGrupSubfilters.get("frioCalor")?.setValue("");
  this.formGrupSubfilters.get("tipoVentiladores")?.setValue(""); 
  this.formGrupSubfilters.get("tecnologia")?.setValue(""); 
  this.formGrupSubfilters.get("pulgadas")?.setValue(""); 
  this.formGrupSubfilters.get("tipoAuricular")?.setValue(""); 
  this.formGrupSubfilters.get("sistEnfriamiento")?.setValue(""); 
  this.formGrupSubfilters.get("capacidadLavado")?.setValue(""); 
  this.formGrupSubfilters.get("screenSize")?.setValue(""); 
  this.formGrupSubfilters.get("ram")?.setValue(""); 
  this.formGrupSubfilters.get("processor")?.setValue(""); 
  this.formGrupSubfilters.get("storageSize")?.setValue(""); 
  this.formGrupSubfilters.get("capacidad")?.setValue(""); 
  this.formGrupSubfilters.get("pulgadasCelular")?.setValue(""); 
  this.formGrupSubfilters.get("ramCelular")?.setValue(""); 
  this.formGrupSubfilters.get("screenSizeTablet")?.setValue(""); 
  this.formGrupSubfilters.get("ramTablet")?.setValue(""); 
  this.formGrupSubfilters.get("monochromatic")?.setValue(""); 
  this.formGrupSubfilters.get("is3DPrinter")?.setValue(""); 
  this.formGrupSubfilters.get("hasCableKeyboard")?.setValue(""); 
  this.formGrupSubfilters.get("isWirelessKeyboard")?.setValue(""); 
  this.formGrupSubfilters.get("hasBluetoothKeyboard")?.setValue(""); 
  this.formGrupSubfilters.get("hasCableMouse")?.setValue(""); 
  this.formGrupSubfilters.get("isWirelessMouse")?.setValue(""); 
  this.formGrupSubfilters.get("hasBluetoothMouse")?.setValue(""); 


}

obtainCharacteristicsArrayOfStringCharacteristics(stringCharacteristics: string): string[]{
  return stringCharacteristics.split(",");
}



private async getListFilteredBySubFilters(productListSubFilteredByCategory: ProductInterface[], formGroup: FormGroup, category: string){
  let filteredProductsListInterface = productListSubFilteredByCategory;
    
  console.log("ATRODEN SUB FILTERS");
  //FILTRA POR MARCA
  if(formGroup.get("brand")?.value != Brand.NONE){
    console.log("ATRODEN BRAND");
    filteredProductsListInterface = this.getListFilteredByBrand(filteredProductsListInterface, formGroup.get("brand")?.value);
  }
  
  // FILTRA POR CARACTERISTICAS DE CATEGORIA
  switch(category){
    case 'Aire Acondicionado':
      if(formGroup.get("airTypes")?.value != ""){
        console.log("ATRODEN AA");
        //filteredProductsListInterface = this.getListFilteredByAirType(filteredProductsListInterface, formGroup.get("airTypes")?.value);
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"airTypes", formGroup.get("airTypes")?.value);
      }
      if(formGroup.get("frioCalor")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"frioCalor", formGroup.get("frioCalor")?.value);
      }
        break;
    case 'Ventiladores':
      if(formGroup.get("tipoVentiladores")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"tipoVentiladores", formGroup.get("tipoVentiladores")?.value);
      }
        break; 
    case 'Televisores':
      if(formGroup.get("tecnologia")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"tecnologia", formGroup.get("tecnologia")?.value);
      };
      if(formGroup.get("pulgadas")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"pulgadas", formGroup.get("pulgadas")?.value);
      };
        break; 
    case 'Auriculares':
      if(formGroup.get("tipoAuricular")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"tipoAuricular", formGroup.get("tipoAuricular")?.value);
      };
        break; 
    case 'Parlantes':
        break; 
    case 'Heladeras':
      if(formGroup.get("sistEnfriamiento")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"sistEnfriamiento", formGroup.get("sistEnfriamiento")?.value);
      };
        break; 
    case 'Lavarropas':
      if(formGroup.get("capacidadLavado")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"capacidadLavado", formGroup.get("capacidadLavado")?.value);
      };
        break;
    case 'Aspiradoras':
        break;
    case 'Microondas':
      if(formGroup.get("capacidad")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"capacidad", formGroup.get("capacidad")?.value);
      };
        break; 
    case 'Tostadora':
        break;
    case 'Celulares':
      if(formGroup.get("pulgadasCelular")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"pulgadasCelular", formGroup.get("pulgadasCelular")?.value);
      }
      if(formGroup.get("ramCelular")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"ramCelular", formGroup.get("ramCelular")?.value);
      } 
        break;
    case 'Notebooks':
      if(formGroup.get("screenSize")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"screenSize", formGroup.get("screenSize")?.value);
      }
      if(formGroup.get("ram")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"ram", formGroup.get("ram")?.value);
      }
      if(formGroup.get("processor")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"processor", formGroup.get("processor")?.value);
      }
      if(formGroup.get("storageSize")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"storageSize", formGroup.get("storageSize")?.value);
      }
        break;
    case 'Tablets':
      if(formGroup.get("screenSizeTablet")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"screenSizeTablet", formGroup.get("screenSizeTablet")?.value);
      }
      if(formGroup.get("ramTablet")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"ramTablet", formGroup.get("ramTablet")?.value);
      }
        break; 
    case 'Impresoras':
      if(formGroup.get("monochromatic")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"monochromatic", formGroup.get("monochromatic")?.value);
      }
      if(formGroup.get("is3DPrinter")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"is3DPrinter", formGroup.get("is3DPrinter")?.value);
      }
        break; 
    case 'Computadoras de Escritorio':
        break;
    case 'Teclados':
      if(formGroup.get("hasCableKeyboard")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"hasCableKeyboard", formGroup.get("hasCableKeyboard")?.value);
      }
      if(formGroup.get("isWirelessKeyboard")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"isWirelessKeyboard", formGroup.get("isWirelessKeyboard")?.value);
      }
      if(formGroup.get("hasBluetoothKeyboard")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"hasBluetoothKeyboard", formGroup.get("hasBluetoothKeyboard")?.value);
      }
        break;
    case 'Mouses':
      if(formGroup.get("hasCableMouse")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"hasCableMouse", formGroup.get("hasCableMouse")?.value);
      }
      if(formGroup.get("isWirelessMouse")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"isWirelessMouse", formGroup.get("isWirelessMouse")?.value);
      }
      if(formGroup.get("hasBluetoothMouse")?.value != ""){
        filteredProductsListInterface = this.getListFilteredCharacteristics(filteredProductsListInterface,"hasBluetoothMouse", formGroup.get("hasBluetoothMouse")?.value);
      }
        break;
}


  
  //Asignar lista a mostrar
  this.productListSubFiltered = filteredProductsListInterface;

}

private getListFilteredByBrand(productsListInterface: ProductInterface[], brand: string): ProductInterface[]{
  return productsListInterface.filter(product => product.brand == brand);
}



  getListFilteredCharacteristics(productsListInterface: ProductInterface[], typeName: string, typeValue: string): ProductInterface[]{
    let producList: ProductInterface[] = [];
    productsListInterface.forEach(productinterface =>{
      let characteristics = this.obtainCharacteristicsArrayOfStringCharacteristics(productinterface.characteristics);
      if(characteristics[characteristics.indexOf(typeName) + 1]  == typeValue ){
        console.log("*");
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
 
 

obtainBrandListFilteredByCategory(prductListInterface: ProductInterface[]){
  let brandList: string[] = []
  prductListInterface.forEach(product =>{
    if(!brandList.includes(product.brand)){
      brandList.push(product.brand);
    }
  });
  return brandList;
}





}
