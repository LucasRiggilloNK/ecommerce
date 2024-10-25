import { Brand } from "./brands/brand";
import { Category } from "./categories/category";
import { Image } from "./images/image";

export class Product {
    idProduct: string;
    brand: Brand;
    category: Category;
    image: Image;
    description: string;
    price: number;
    stock: number;
    characteristics: string;

    constructor(idProduct: string, brand: Brand, category: Category, image: Image, description: string, price: number,
                stock: number,characteristics: string){
        this.idProduct = idProduct;
        this.brand = Brand.NONE;
        this.category = Category.NONE;
        this.image = new Image("");
        this.description = "";
        this.price = 0;
        this.stock = 0;
        this.characteristics = "";
    }
    
    
}
