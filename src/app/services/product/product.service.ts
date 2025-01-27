import { Injectable } from '@angular/core';
import { AsyncService } from '../async.service';
import { Brand } from '../../models/products/brands/brand';
import { Category } from '../../models/products/categories/category';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { Purchase } from '../../models/purchases/purchase';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';

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
  
  airTypesList: string[] = [
    'Todos',
    'Split',
    'Portatil',
    'Split inverter',
    'Ventana',
  ];
  heatColdList: string[] = ['Todos', 'Si', 'No'];
  fanTypeList: string[] = ['Todos', 'Pie', 'Turbo'];
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

  constructor(private asyncService: AsyncService, private http: HttpClient) {
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
  
  getCharacteristicsList(type: string): string[] {
    return this.characteristicsMap[type] || [];
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
  
  
}
