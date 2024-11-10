import { Injectable } from '@angular/core';
import { Product } from '../../models/products/product';
import { AsyncService } from '../async.service';
import { Brand } from '../../models/products/brands/brand';
import { Category } from '../../models/products/categories/category';
import { ProductInterface } from '../../interfaces/product/product-interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsApiUrl = 'http://localhost:3000/products';
  private productsListInt: ProductInterface[] = [];
  private productInt: ProductInterface | null = null;
  private airTypesListValues: string[] = ['split', 'portatil', 'split inverter', 'ventana'];
  private heatColdList = ['Sí', 'No'];
  private fanTypeListvalues = ['Pie', 'Turbo'];
  private tvTechnologiesList: string[] = ['LED', 'OLED', 'AMOLED', 'QLED', 'NanoCell'];
  private tvInchesList: string[] = ['32"', '43"', '55"', '60"', '70"', '75"'];
  private headphonesTypeListvalues = ['inEar', 'headBand'];
  private coolingSystemList: string[] = ['no frost', 'ciclico', 'cycle defrost', 'cilcico', 'cycle desfrost', 'mono cooling', 'skin condenser'];
  private washingCapacityList: string[] = ['6 kg', '7 kg', '8 kg', '9 kg', '10 kg', '11 kg'];
  private microwaveCapacityList: string[] = ['15 lts', '17 lts', '20 lts', '23 lts', '25 lts', '28 lts', '30 lts', '32 lts', '35 lts', '40 lts', '42 lts', '45 lts'];
  private smartPhoneInchesList: string[] = ['4.0"', '4.7"', '5.0"', '5.5"', '5.8"', '6.1"', '6.3"', '6.5"', '6.7"', '6.8"', '7.0"'];
  private smartPhoneRamList: string[] = ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB', '18 GB'];
  private notebookScreenSizesList: string[] = [ '13"', '14"', '15"', '15.6"', '16"', '17"'];
  private notebookRamList: string[] = ['4 GB', '8 GB', '12 GB', '16 GB', '32 GB', '64 GB'];
  private notebookProcessorsList: string[] = ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Intel Pentium Gold'];
  private notebookStorageSizesList: string[] = ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB', '8TB', '16TB', '32TB', '64TB'];
  private tabletScreenSizesList: string[] = ['7"', '8"', '9"', '10"', '10.5"', '11"', '12.4"', '12.9"', '13"', '14"'];
  private tabletRamList: string[] = ['2 GB', '3 GB', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB'];
  private printerTypeList: string[] = ["color", "monochomatic", "3D"];
  private isMonochromatic: string[] = ['Si', 'No'];
  private is3DPrinter: string[] = ['Sí', 'No'];
  private conectivityTypeList: string[] = ["cable","wireless","bluetooth"]

  
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
      id: 1,
    };
  }

  //////////////////////    GET PRODUCTS     ////////////////////////////////////////////////////

  public getProductsListInterfaceObservable() {
    return this.asyncService.getAll(this.productsApiUrl);
  }

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
    id: number
  ): Promise<ProductInterface | null> {
    try {
      const response = await this.asyncService.getByIdPromise(
        id,
        `${this.productsApiUrl}/`
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
    switch(type) {
        case 'airTypes': 
          out = this.airTypesListValues;
        break;
        case 'frioCalor': 
          out = this.heatColdList;
        break;
        case 'tipoVentiladores': 
          out = this.fanTypeListvalues;
        break;
        case 'tipoAuricular': 
          out = this.headphonesTypeListvalues;
        break;
        case 'tipoConectividad':  //para teclado y mouse
          out = this.conectivityTypeList;
        break;
        case 'capacidad': 
          out = this.microwaveCapacityList;
        break;
        case 'screenSize': 
          out = this.notebookScreenSizesList;
        break;
        case 'ram': 
          out = this.notebookRamList;
        break;
        case 'processor': 
          out = this.notebookProcessorsList;
        break;
        case 'storageSize': 
          out = this.notebookStorageSizesList;
        break;
        case 'printerType': 
          out = this.printerTypeList;
        break;
        case 'sistEnfriamiento': 
          out = this.coolingSystemList;
        break;
        case 'pulgadas': 
          out = this.smartPhoneInchesList;
        break;
        case 'ram': 
          out = this.smartPhoneRamList;
        break;
        case 'pulgadas': 
          out = this.smartPhoneRamList;
        break;
        case 'ram': 
          out = this.smartPhoneRamList;
        break;

    } 
    return out;
         
  }











/* 


smarthphones
 "pulgadas"
      "ram"

tablet
"screenSize"  
    "ram"


tv
"tecnologia"
      "pulgadas"


washing
 "capacidadLavado"
 */

}
