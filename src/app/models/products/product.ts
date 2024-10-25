import { Brand } from "./brands/brand";
import { Category } from "./categories/category";
import { Image } from "./images/image";

export class Product {
    idProduct: string;
    name: string;
    brand: Brand;
    category: Category;
    image: Image;
    description: string;
    price: number;
    stock: number;

    constructor(){
        this.idProduct = "";
        this.name = "";
        this.brand = Brand.NONE;
        this.category = Category.NONE;
        this.image = new Image("");
        this.description = "";
        this.price = 0;
        this.stock = 0;
    }
    
    
}
