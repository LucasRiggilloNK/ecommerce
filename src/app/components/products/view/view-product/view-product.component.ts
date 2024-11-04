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
  //brandList: string[] = Object.values(Brand);
  brandList: string[] = [];

  productListFilteredByCategory: ProductInterface[] = [];
  productListSubFiltered: ProductInterface[] = [];
  //formControlGroupFilter: FormGroup;
 formControlCategory: FormControl;
 formGrupSubfilters: FormGroup;


  valueChangesSubscription?: Subscription;
  valueChangesformGrupSubfiltersSubscription?: Subscription;
  
  characteristicsList: string[] = [];



  airTypesListValues: string[] = ["split", "portatil", "split inverter", "ventana"];
  fanTypeListvalues = ["Pie", "Turbo"];




  constructor(private productService: ProductService) {

    this.subscriptionGetProductListInterface = new Subscription();
    this.subscriptionGetProductInterfaceById = new Subscription();
    this.formControlById = new FormControl();

    //Elimina el elemento none en categoryList
    let indiceNONE = this.categoryList.indexOf(Category.NONE)
    this.categoryList.splice(indiceNONE, 1);


    /* this.formControlGroupFilter = new FormGroup({
      "category": new FormControl(Category.NONE),
      "brand": new FormControl(Brand.NONE)
    }); */
    this.formControlCategory = new FormControl();
    this.formGrupSubfilters = new FormGroup({
      "brand": new FormControl(Brand.NONE),
      //Aire acondicionado
      "airTypes": new FormControl(""),
      "frioCalor": new FormControl(""),
      // Ventiladores
      "tipoVentiladores": new FormControl("")

    }
     
    );
  }
ngOnInit(): void {
  this.getProductListInterface();
   /* this.valueChangesSubscription = this.formControlGroupFilter.valueChanges.subscribe(
    form =>{
      this.getConditionOfLoadProductsFilteredByCategory(this.formControlGroupFilter);
    }
    
  );   */
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


  

  //////////////////////////////7   GET    //////////////////////////////////////////////////
  /* getProductListInterface(){
    
    this.subscriptionGetProductListInterface = this.productService.getProductsListInterfaceObservable().subscribe(
      response =>{
        this.productsListInt = response;
      }, error =>{
        alert("Error de lectura metodo GET de API products.json...");
      }
    );
    console.log("*");
    console.log(this.productsListInt);
    
  } */

  
      async getProductListInterface(){
    
        this.productsListInt = await this.productService.getAllProductsListInterface();
      
      console.log("*");
      console.log(this.productsListInt);
      
    } 


    /* async getProductListInterface(){FUNVIONA
    
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


//////////////////////////   ADD    ///////////////////////////////////////77
  addGenericProduct(){
    let product = new Product();
      product.setId(this.productsListInt.length + 1);
      product.setBrand(Brand.APPLE);
      product.setCategory(Category.CELULARES);
      product.setCharacteristics("5456fd4f");
      product.setDescription("BLA BLA BLA");
      product.setImage(new Image("IMAGEN URL"));
      product.setModel("LG445588");
      product.setPrice(500000);
      product.setStock(1000);



      this.productService.addProductApi(product).subscribe(
        response =>{
          this.getProductListInterface();

        },
        error =>{
          alert("Error al agregar producto...");
        }
      );

      //this.getProductListInterface();
      
      
  }

//////////////////////////////////////7   GET BY ID   ///////////////////////////////////////////////////777

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

/* getConditionOfLoadProductsFilteredByCategory():boolean{//FUNCIONA
  
  let productListSubFiltered: ProductInterface[] = [];
  this.productListSubFiltered =  [];

  let productListFilteredByCategory = this.getFilterByCategory(this.productsListInt, this.formControlGroupFilter.get("category")?.value);
  let out = false;

  if(productListFilteredByCategory.length != 0){
    this.productListFilteredByCategory = productListFilteredByCategory;

    if(this.predefinedValueFilters()){
      console.log("ATRODEN");
      this.productListSubFiltered = this.productListFilteredByCategory;

    } else{
      productListSubFiltered = this.applySubFilters(this.productListFilteredByCategory);
      if(productListSubFiltered.length != 0){
        this.productListSubFiltered = productListSubFiltered;
        
      }else{
        this.formControlGroupFilter.get("brand")?.setValue(Brand.NONE);
      }
    } 
    out = true;
  }

  return out;
} */


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


}

obtainCharacteristicsArrayOfStringCharacteristics(stringCharacteristics: string): string[]{
  return stringCharacteristics.split(",");
}



/* removeFormControlsAddedAtformGrupSubfilters(formGrupSubfilters: FormGroup){//restablece el formGrupSubfilters
  Object.keys(formGrupSubfilters.controls).forEach( key =>{
    if(key != "category" && key != "brand"){
      formGrupSubfilters.removeControl(key);
    }
  });
} */

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
        console.log("***");
        console.log(filteredProductsListInterface);
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
        break; 
    case 'Auriculares':
        break; 
    case 'Parlantes':
        break; 
    case 'Heladeras':
        break; 
    case 'Lavarropas':
        break;
    case 'Aspiradoras':
        break;
    case 'Microondas':
        break; 
    case 'Tostadora':
        break;
    case 'Celulares':
        break;
    case 'Notebooks':
        break;
    case 'Tablets':
        break; 
    case 'Impresoras':
        break; 
    case 'Computadoras de Escritorio':
        break;
    case 'Teclados':
        break;
    case 'Mouses':
        break;
}


  
  //Asignar lista a mostrar
  this.productListSubFiltered = filteredProductsListInterface;

}

private getListFilteredByBrand(productsListInterface: ProductInterface[], brand: string): ProductInterface[]{
  return productsListInterface.filter(product => product.brand == brand);
}

/* getListFilteredByAirType(productsListInterface: ProductInterface[], airType: string): ProductInterface[]{
  let producList: ProductInterface[] = [];
  productsListInterface.forEach(productinterface =>{
    let characteristics = this.obtainCharacteristicsArrayOfStringCharacteristics(productinterface.characteristics);
    if(characteristics[characteristics.indexOf("airTypes") + 1]  == airType ){
      console.log("*");
      console.log(productinterface);
      producList.push(productinterface);
    }
  });
  return producList;
} */

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

getListFilteredByFrioCalor(productsListInterface: ProductInterface[], frioCalor: string): ProductInterface[]{
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

 /*   async getConditionOfLoadProductsFilteredByCategory(formControlGroupFilter: FormGroup){

    console.log(formControlGroupFilter.get("category")?.value);
    console.log(formControlGroupFilter.get("brand")?.value);

    let filteredProductsListInterface: ProductInterface[] = [];
    this.brandList = [];
    let out = false;

    if(formControlGroupFilter.get("category")?.value != Category.NONE){//none está cargado iniciamente en el formControl. Si está así, no muestra nada
      //filtrado por todos los filtros
      console.log("ATRODEN");
      filteredProductsListInterface = await this.getAllProductsListInterface();// carga todos los productos
      console.log(filteredProductsListInterface);

      filteredProductsListInterface = this.getFilterByCategory(filteredProductsListInterface, formControlGroupFilter.get("category")?.value);//filtro categoria
      console.log(filteredProductsListInterface);

      this.brandList = this.obtainBrandListFilteredByCategory(filteredProductsListInterface);// obtiene las marcas de los productos filtrados
      console.log(this.brandList);
      

      if(formControlGroupFilter.get("brand")?.value != Brand.NONE){
        
        filteredProductsListInterface = filteredProductsListInterface.filter(poduct => poduct.brand === formControlGroupFilter.get("brand")?.value);
        console.log(filteredProductsListInterface);

      }
      
      

       
      out = true;
    } 
    
  
    

      this.productListSubFiltered = filteredProductsListInterface;
  
    return out;
  }*/
 

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
