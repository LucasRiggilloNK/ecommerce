import { Injectable } from '@angular/core';
import { AsyncService } from '../async.service';
import { Brand } from '../../models/products/brands/brand';
import { Category } from '../../models/products/categories/category';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { Purchase } from '../../models/purchases/purchase';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductInterface2 } from '../../interfaces/product/product-interface2';
import { response } from 'express';
import { ProductcCharacteristicsService } from './product-characteristics.service';
import { FanType } from '../../models/products/characteristics/fan-type';
import { AirType } from '../../models/products/characteristics/air-type';
import { HeatCold } from '../../models/products/characteristics/heat-cold';
import { Conectivity } from '../../models/products/characteristics/conectivity';
import { MemoryUnit } from '../../models/products/characteristics/memory-unit';
import { Processor } from '../../models/products/characteristics/processor';
import { CoolingSystem } from '../../models/products/characteristics/cooling-system';
import { PrinterType } from '../../models/products/characteristics/printer-type';
import { HeadphoneType } from '../../models/products/characteristics/headphone-type';
import { ScreenTechnology } from '../../models/products/characteristics/screen-technology';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsApiUrl = 'http://localhost:3003/products';
  private productsListInt: ProductInterface[] = [];
  private productInt: ProductInterface | null = null;
  private productToVievDetails: ProductInterface;
  private purchase: Purchase | null = null;
  private formControlCategorySesion: FormControl;
  private formGroupSubfiltersSesion: FormGroup;


  //////////////////////////   AGREGADO   ///////////////////////////////////77

  private _productsApiUrl = 'http://localhost:3010/_products';

  //////////////////////////////////////////////////////////////////////////

  /* airTypesList: string[] = [
    'Todos',
    'Split',
    'Portatil',
    'Split inverter',
    'Ventana',
  ]; */
  private airTypesList: string[] = Object.values(AirType).sort();
  /* heatColdList: string[] = ['Todos', 'Si', 'No']; */
  private heatColdList: string[] = Object.values(HeatCold).sort();
  //fanTypeList: string[] = ['Todos', 'Pie', 'Turbo'];
  private fanTypeList: string[] = Object.values(FanType).sort();

  private processorsList: string[] = Object.values(Processor).sort();


  /* tvTechnologiesList: string[] = [
    'Todos',
    'LED',
    'OLED',
    'AMOLED',
    'QLED',
    'NanoCell',
    'FHD',
  ]; */
  private screenTechnologiesList: string[] = Object.values(ScreenTechnology).sort();
  /* tvInchesList: string[] = [
    'Todos',
    '32"',
    '43"',
    '55"',
    '60"',
    '70"',
    '75"',
    '98"',
  ]; */
  /* headphonesTypeList = ['Todos', 'inEar', 'headBand']; */
  private headphonesTypeList = Object.values(HeadphoneType).sort();
  /* refrigeratorCoolingSystemList: string[] = [
    'Todos',
    'No frost',
    'Ciclico',
    'Cycle defrost',
    'Mono cooling',
    'Skin condenser',
  ]; */
  private coolingSystemList: string[] = Object.values(CoolingSystem).sort();
  /* washingCapacityList: string[] = [
    'Todos',
    '6 kg',
    '6.5 kg',
    '7 kg',
    '8 kg',
    '9 kg',
    '10 kg',
    '11 kg',
  ];
  microwaveCapacityList: string[] = [
    'Todos',
    '15 lts',
    '17 lts',
    '20 lts',
    '23 lts',
    '25 lts',
    '28 lts',
    '30 lts',
    '32 lts',
    '35 lts',
    '40 lts',
    '42 lts',
    '45 lts',
  ];
  smartPhoneInchesList: string[] = [
    'Todos',
    '6.1"',
    '6.5"',
    '6.6"',
    '6.7"',
    '6.8"',
    '7.0"',
  ]; */
  //private smartPhoneRamList: string[] = ['Todos', '4 GB', '6 GB', '8 GB', '12 GB'];
  /* notebookScreenSizesList: string[] = [
    'Todos',
    '13"',
    '14"',
    '15"',
    '15.6"',
    '16"',
    '17"',
  ];
  notebookRamList: string[] = [
    'Todos',
    '4 GB',
    '8 GB',
    '12 GB',
    '16 GB',
    '32 GB',
    '64 GB',
  ];
  notebookProcessorsList: string[] = [
    'Todos',
    'Intel Core i3',
    'Intel Core i5',
    'Intel Core i7',
    'Intel Core i9',
    'AMD Ryzen 3',
    'AMD Ryzen 5',
    'AMD Ryzen 7',
    'AMD Ryzen 9',
    'Apple M1',
    'Apple M2',
    'Intel Pentium Gold',
  ];
  notebookStorageSizesList: string[] = [
    'Todos',
    '128GB',
    '256GB',
    '512GB',
    '1TB',
    '2TB',
    '4TB',
    '8TB',
    '16TB',
    '32TB',
    '64TB',
  ]; */
  /* tabletScreenSizesList: string[] = [
    'Todos',
    '7"',
    '8"',
    '9"',
    '10"',
    '10.1"',
    '10.5"',
    '11"',
    '12.4"',
    '12.9"',
    '13"',
    '14"',
  ]; */
  /* tabletRamList: string[] = [
    'Todos',
    '2 GB',
    '3 GB',
    '4 GB',
    '6 GB',
    '8 GB',
    '12 GB',
    '16 GB',
  ]; */
  /* printerTypeList: string[] = ['Todos', 'Color', 'Monocromática', '3D']; */
  private printerTypeList: string[] = Object.values(PrinterType).sort();
  /* keyboardConnectivityTypeList: string[] = [
    'Todos',
    'Cable',
    'Wireless',
    'Bluetooth',
  ]; */
  /* mouseConnectivityTypeList: string[] = [
    'Todos',
    'Cable',
    'Wireless',
    'Bluetooth',
  ]; */
  private connectivityTypeList: string[] = Object.values(Conectivity).sort();

  constructor(private asyncService: AsyncService, private http: HttpClient, private productCharacteristicsService: ProductcCharacteristicsService) {
    this.productInt = {
      brand: Brand.NONE,
      category: Category.NONE,
      urlImage: '',
      description: '',
      price: 0,
      stock: 0,
      characteristics: '',
      model: '',
      id: '1',
      quantity: 0,
    };
    this.productToVievDetails = {
      brand: Brand.NONE,
      category: Category.NONE,
      urlImage: '',
      description: '',
      price: 0,
      stock: 0,
      characteristics: '',
      model: '',
      id: '1',
      quantity: 0,
    };

    this.formControlCategorySesion = new FormControl("");
    //this.formGroupSubfiltersSesion = new FormGroup("");
    this.formGroupSubfiltersSesion = new FormGroup({
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

    /* this.airTypesList.push("Todos");
    this.heatColdList.push("Todos"); */
    
  }

  //////////////////////    GET PRODUCTS     ////////////////////////////////////////////////////

  public async getAllProductsListInterface(): Promise<ProductInterface[]> {
    try {
      const response = await this.asyncService.getAllPromise(
        this.productsApiUrl
      );
      return response ?? []; // Devuelve `response` si está definido; de lo contrario, un array vacío
    } catch (error) {
      console.error('Error al obtener productos de archivo json', error); // Mejor log que un alert
      return [];
    }
  }

  ////////////  AGREGADO  ////////////////////////////////////////
  public getAllProductsListInterface2(): Observable<ProductInterface2[]> {
    return this.asyncService.getAll(this._productsApiUrl);
    
  }
  ////////////////////////////////////////////////////////////////////////////////

  //////////////////////    ADD PRODUCTS     ////////////////////////////////////////////////////

  public async addProductInterfaceApi(
    productInt: ProductInterface
  ): Promise<ProductInterface | null> {
    try {
      const response = await this.asyncService.add(
        productInt,
        this.productsApiUrl
      );
      return response;
    } catch (error) {
      console.error('Error al agregar producto al archivo json', error);
      return null;
    }
  }

  //////////////////////    GET BY ID     ////////////////////////////////////////////////////

  public async getProductInterfaceById(
    id: string
  ): Promise<ProductInterface | null> {
    try {
      const response = await this.asyncService.getByIdPromise(
        id,
        `${this.productsApiUrl}`
      );
      return response;
    } catch (error) {
      console.error(
        'Error al obtener producto por ID o producto inexistente',
        error
      );
      return null;
    }
  }

//////////////////////    UPDATE PRODUCTS     ////////////////////////////////////////////////////

  public updateProduct(product: ProductInterface): Observable<ProductInterface>{
    return this.asyncService.updateProduct(product.id, product, this.productsApiUrl);
  }

  //////////////////////    DELETE PRODUCTS     ////////////////////////////////////////////////////
  public deleteProduct(product: ProductInterface): Observable<ProductInterface>{
    return this.asyncService.deleteProduct(product.id, this.productsApiUrl);
  }


  //////////////////////    FILTER PRODUCTS     ////////////////////////////////////////////////////

  filterByCategory(
    producListInterface: ProductInterface[],
    category: string
  ): ProductInterface[] {
    return producListInterface.filter(
      (product) => product.category === category
    );
  }
  updateProductStock(productId: string, quantitySold: number): void {
    this.getProductById(productId).subscribe(product => {
      if (!product) {
        console.error(`No se encontró el producto con ID ${productId}`);
        return;
      }
  
      const updatedStock = product.stock - quantitySold;
      if (updatedStock < 0) {
        console.error(`No hay suficiente stock para el producto ${productId}`);
        return;
      }
  
      this.http.patch(`${this.productsApiUrl}/${productId}`, { stock: updatedStock }).subscribe(
        () => console.log(`Stock actualizado para el producto ${productId}`),
        (error) => console.error(`Error al actualizar el stock para ${productId}`, error)
      );
    });
  }
  

  getProductById(productId: string): Observable<ProductInterface> {
    return this.http.get<ProductInterface>(
      `http://localhost:3003/products/${productId}`
    );
  }

  pathProducts() {}

  filterByBrand(
    producListInterface: ProductInterface[],
    brand: string
  ): ProductInterface[] {
    return producListInterface.filter((product) => product.brand === brand);
  }

  //////////////////////    GET CHARACTERISTICS     ////////////////////////////////////////////////////
/*
  private characteristicsMap: Record<string, string[]> = {
    airTypes: this.airTypesList,
    heatCold: this.heatColdList,
    fanType: this.fanTypeList,
    headphoneType: this.headphonesTypeList,
    microwaveCapacity: this.microwaveCapacityList,
    notebookScreenSize: this.notebookScreenSizesList,
    notebookRam: this.notebookRamList,
    notebookProcessor: this.notebookProcessorsList,
    notebookStorageSize: this.notebookStorageSizesList,
    printerType: this.printerTypeList,
    refrigeratorCoolingSystem: this.refrigeratorCoolingSystemList,
    smartphoneInches: this.smartPhoneInchesList,
    smartphoneRam: this.smartPhoneRamList,
    tabletScreenSize: this.tabletScreenSizesList,
    tabletRam: this.tabletRamList,
    tvTecnology: this.tvTechnologiesList,
    tvInches: this.tvInchesList,
    washingCapacity: this.washingCapacityList,
    keyboardConnectivityType: this.keyboardConnectivityTypeList,
    mouseConnectivityType: this.mouseConnectivityTypeList,
  };
  */
 
  getCharacteristicsList(type: string): string[] {
    let out: string[] = [];
    switch (type) {
      case 'airTypes':
        out = this.airTypesList;
        break;
      case 'heatCold':
        out = this.heatColdList;
        break;
      case 'fanType':
        out = this.fanTypeList;
        break;
      case 'headphoneType':
        out = this.headphonesTypeList;
        break;
      /* case 'microwaveCapacity':
        out = this.microwaveCapacityList;
        break;
      case 'notebookScreenSize':
        out = this.notebookScreenSizesList;
        break;
      case 'notebookRam':
        out = this.notebookRamList;
        break;
      case 'notebookProcessor':
        out = this.notebookProcessorsList;
        break;
      case 'notebookStorageSize':
        out = this.notebookStorageSizesList;
        break; */
      case 'printerType':
        out = this.printerTypeList;
        break;
      case 'coolingSystem':
        out = this.coolingSystemList;
        break;
      /* case 'smartphoneInches':
        out = this.smartPhoneInchesList;
        break; */
      /* case 'smartphoneRam':
        out = this.smartPhoneRamList;
        break; */
     /*  case 'tabletScreenSize':
        out = this.tabletScreenSizesList;
        break;
      case 'tabletRam':
        out = this.tabletRamList;
        break; */
      case 'screenTechnology':
        out = this.screenTechnologiesList;
        break;
      /* case 'tvInches':
        out = this.tvInchesList;
        break;
      case 'washingCapacity':
        out = this.washingCapacityList;
        break; */
      /* case 'keyboardConnectivityType':
        out = this.keyboardConnectivityTypeList;
        break; */
      case 'connectivity':
        out = this.connectivityTypeList;
        break;
      case 'processor':
          out = this.processorsList;
              break;
    }
    return out;
  }
  

  ////////////////////////////////////    DETALLES PRODUCTO    //////////////////////////////////////////

  async getLatestProductId(): Promise<number> {
    const allProducts = await this.getAllProductsListInterface();
    return allProducts.length ? Math.max(...allProducts.map((p) => Number(p.id))) : 0;
  }
  

  async productExists(product: ProductInterface): Promise<boolean> {
    try {
      const productsInterfaceList = await this.asyncService.getAllPromise(this.productsApiUrl);
      return productsInterfaceList?.some(prod => product.brand === prod.brand && product.model === prod.model) ?? false;
    } catch (error) {
      console.error('No se pudo verificar si existe el producto...', error);
      return false;
    }
  }
  

  ///////////////////////////  FORM CONTROL y GROUP  ///////////////////////////////////
  setFormControlCategorySesion(form: FormControl){
    this.formControlCategorySesion = form;
  }
  getFormControlCategorySesion(): FormControl{
    return this.formControlCategorySesion;
  }













  //////////////////////////////////////////////   AGREGADO   /////////////////////////////////////////////////

  getAllProducts(): Observable<ProductInterface2[]> {
      return this.asyncService.getAll(this._productsApiUrl); 
    }
  
  
    addProduct(product: ProductInterface2): Observable<ProductInterface2> {
      return this.asyncService.addProduct(product, this._productsApiUrl);
    }
  
    _getProductById(productId: string): Observable<ProductInterface2> {
      return this.asyncService.getProductById(productId, this._productsApiUrl);
    }

  
    _productExists(product: ProductInterface): boolean {
      let productsInterfaceList: ProductInterface2[] | undefined = [];
      let out = false;
      let p: ProductInterface2 | undefined;
  
      this.getAllProducts().subscribe({
        next: response =>{
          productsInterfaceList = response;
  
          if (productsInterfaceList != undefined) {
            p = productsInterfaceList.find(
              (prod) =>
                product.brand === prod.brand && product.model === prod.model
            );
            
            if (p != undefined) {
              out = true;
            }
          }





        },
        error: error =>{
          console.log("Error al verificar existencia del producto...");
          console.log(error);
        }
      });

  
      
      return out;
    }




    public initProductInterface(){//crea un producto vacío
  
      let product: ProductInterface2 = {
        
            id: "",
              brand: Brand.NONE,
              category: Category.NONE,
              urlImage: "",
              description: "",
              price: 0,
              stock: 0,
              characteristics: this.productCharacteristicsService.initCharacteristics(),
              model: "",
              quantity: 0
        
      }
      return product;
    }

    public _deleteProduct(product: ProductInterface2): Observable<ProductInterface2>{
      return this.asyncService._deleteProduct(product.id, this._productsApiUrl);
    }

    public _updateProduct(product: ProductInterface2): Observable<ProductInterface2>{
      return this.asyncService._updateProduct(product.id, product, this._productsApiUrl);
    }




    getRAMListFromData(category: string){
      this.getAllProducts()
    }
}
