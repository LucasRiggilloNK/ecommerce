import { Injectable } from '@angular/core';
import { Product } from '../../models/products/product';
import { AsyncService } from '../async.service';
import { Brand } from '../../models/products/brands/brand';
import { Category } from '../../models/products/categories/category';
import { ProductInterface } from '../../interfaces/product/product-interface';
import { response, Router } from 'express';
import { error } from 'console';
import { ActivatedRoute, Route } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsApiUrl = 'http://localhost:3001/products';
  private productsListInt: ProductInterface[] = [];
  private productInt: ProductInterface | null = null;
  private productToVievDetails: ProductInterface;

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
  tvInchesList: string[] = ['Todos', '32"', '43"', '55"', '60"', '70"', '75"'];
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
    '4.0"',
    '4.7"',
    '5.0"',
    '5.5"',
    '5.8"',
    '6.1"',
    '6.3"',
    '6.5"',
    '6.6"',
    '6.7"',
    '6.8"',
    '7.0"',
  ];
  smartPhoneRamList: string[] = [
    'Todos',
    '4 GB',
    '6 GB',
    '8 GB',
    '12 GB',
    '16 GB',
    '18 GB',
  ];
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

  constructor(private asyncService: AsyncService) {
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
    };
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
      alert('Producto agregado exitosamente');
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
        /* `${this.productsApiUrl}/` */
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

  /* public async setProductToViewDetailsById(id: number){
  
  await this.asyncService.getByIdPromise(id, this.productsApiUrl)
  .then(response =>{
    this.productToVievDetails = response;
    
  })
  .catch(error =>{
    console.log("Error al obtener producto por id**");
    
  });


}

getProductToVievDetails(){
  return this.productToVievDetails;
} */

  async getLatestProductId(): Promise<number> {
    let allProducts: ProductInterface[] = [];
    allProducts = await this.getAllProductsListInterface();

    return Math.max(...allProducts.map((product) => Number(product.id)));
  }
}
