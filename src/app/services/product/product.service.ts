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
  tvTechnologiesList: string[] = [
    'Todos',
    'LED',
    'OLED',
    'AMOLED',
    'QLED',
    'NanoCell',
    'FHD',
  ];
  tvInchesList: string[] = [
    'Todos',
    '32"',
    '43"',
    '55"',
    '60"',
    '70"',
    '75"',
    '98"',
  ];
  headphonesTypeList = ['Todos', 'inEar', 'headBand'];
  refrigeratorCoolingSystemList: string[] = [
    'Todos',
    'No frost',
    'Ciclico',
    'Cycle defrost',
    'Mono cooling',
    'Skin condenser',
  ];
  washingCapacityList: string[] = [
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
  ];
  smartPhoneRamList: string[] = ['Todos', '4 GB', '6 GB', '8 GB', '12 GB'];
  notebookScreenSizesList: string[] = [
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
  ];
  tabletScreenSizesList: string[] = [
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
  ];
  tabletRamList: string[] = [
    'Todos',
    '2 GB',
    '3 GB',
    '4 GB',
    '6 GB',
    '8 GB',
    '12 GB',
    '16 GB',
  ];
  printerTypeList: string[] = ['Todos', 'Color', 'Monocromática', '3D'];
  keyboardConnectivityTypeList: string[] = [
    'Todos',
    'Cable',
    'Wireless',
    'Bluetooth',
  ];
  mouseConnectivityTypeList: string[] = [
    'Todos',
    'Cable',
    'Wireless',
    'Bluetooth',
  ];

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
    this.getProductById(productId).subscribe((product) => {
      const updatedStock = product.stock - quantitySold;

      if (updatedStock < 0) {
        console.error(`No hay suficiente stock para el producto ${productId}`);
        return;
      }

      this.http
        .patch(`http://localhost:3003/products/${productId}`, {
          stock: updatedStock,
        })
        .subscribe(
          () => {
            console.log(`Stock actualizado para el producto ${productId}`);
          },
          (error) => {
            console.error(
              `Error al actualizar el stock para ${productId}`,
              error
            );
          }
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
      case 'microwaveCapacity':
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
        break;
      case 'printerType':
        out = this.printerTypeList;
        break;
      case 'refrigeratorCoolingSystem':
        out = this.refrigeratorCoolingSystemList;
        break;
      case 'smartphoneInches':
        out = this.smartPhoneInchesList;
        break;
      case 'smartphoneRam':
        out = this.smartPhoneRamList;
        break;
      case 'tabletScreenSize':
        out = this.tabletScreenSizesList;
        break;
      case 'tabletRam':
        out = this.tabletRamList;
        break;
      case 'tvTecnology':
        out = this.tvTechnologiesList;
        break;
      case 'tvInches':
        out = this.tvInchesList;
        break;
      case 'washingCapacity':
        out = this.washingCapacityList;
        break;
      case 'keyboardConnectivityType':
        out = this.keyboardConnectivityTypeList;
        break;
      case 'mouseConnectivityType':
        out = this.mouseConnectivityTypeList;
        break;
    }
    return out;
  }

  ////////////////////////////////////    DETALLES PRODUCTO    //////////////////////////////////////////

  async getLatestProductId(): Promise<number> {
    let allProducts: ProductInterface[] = [];
    allProducts = await this.getAllProductsListInterface();

    return Math.max(...allProducts.map((product) => Number(product.id)));
  }

  async productExists(product: ProductInterface): Promise<boolean> {
    let productsInterfaceList: ProductInterface[] | undefined = [];
    let out = false;
    let p: ProductInterface | undefined;

    await this.asyncService
      .getAllPromise(this.productsApiUrl)
      .then((response) => {
        productsInterfaceList = response;

        if (productsInterfaceList != undefined) {
          p = productsInterfaceList.find(
            (prod) =>
              product.brand === prod.brand && product.model === prod.model
          );
          console.log('p');
          console.log(p);
          if (p != undefined) {
            out = true;
          }
        }
      })
      .catch((error) => {
        alert('No se pudo verificar si existe el producto...');
      });

    console.log('Out: ' + out);
    return out;
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



    ////////////////////////////  AGREGADO  ///////////////////////////////////////////

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
}
