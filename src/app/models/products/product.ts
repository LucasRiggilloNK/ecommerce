import { Brand } from "./brands/brand";
import { Category } from "./categories/category";
import { Image } from "./images/image";

export class Product {
    private brand: Brand;
//    private idProduct: string;
    private idProduct: number;
    private category: Category;
    private description: string;
    private price: number;
    private stock: number;
    private characteristics: string;
    private model: string;
//    private image: Image;
    private image: string;

	/*constructor(idProduct: string, brand: Brand, category: Category, image: Image, description: string, price: number,
		stock: number,characteristics: string, model: string){
		this.idProduct = idProduct;
		this.brand = brand;
		this.category = category;
		this.image = image;
		this.description = description;
		this.price = price;
		this.stock = stock;
		this.characteristics = characteristics;
		this.model = model;
	}*/
	constructor(){
            this.idProduct = 0; // Valor por defecto
            this.brand = Brand.NONE;
            this.category = Category.NONE;
            this.image = '';
            this.description = '';
            this.price = 0;
            this.stock = 0;
            this.characteristics = '';
            this.model = '';
	}




/*     public getIdProduct(): string
 {
        return this.idProduct;
    }

    public setIdProduct(idProduct: string) {
        this.idProduct = idProduct;
    } */
    public getIdProduct(): number
 {
        return this.idProduct;
    }

    public setIdProduct(idProduct: number) {
        this.idProduct = idProduct;
    }

    public getBrand(): Brand
 {
        return this.brand;
    }

    public setBrand(brand: Brand) {
        this.brand = brand;
    }

    public getCategory(): Category
 {
        return this.category;
    }

    public setCategory(category: Category) {
        this.category = category;
    }

/*     public getImage(): Image
 {
        return this.image;
    }

    public setImage(image: Image) {
        this.image = image;
    } */
     public getImage(): string
 {
        return this.image;
    }

    public setImage(image: string) {
        this.image = image;
    } 

    public getDescription(): string
 {
        return this.description;
    }

    public setDescription(description: string) {
        this.description = description;
    }

    public getPrice(): number
 {
        return this.price;
    }

    public setPrice(price: number) {
        this.price = price;
    }

    public getStock(): number
 {
        return this.stock;
    }

    public setStock(stock: number) {
        this.stock = stock;
    }

    public getCharacteristics(): string
 {
        return this.characteristics;
    }

    public setCharacteristics(characteristics: string) {
        this.characteristics = characteristics;
    }

    public getModel(): string {
        return this.model;
    }

    public setModel(model: string) {
        this.model = model;
    }

	
    
    
	
 
    
}
