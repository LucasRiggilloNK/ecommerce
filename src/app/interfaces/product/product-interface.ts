import { Brand } from "../../models/products/brands/brand";
import { Category } from "../../models/products/categories/category";
import { Image } from "../../models/products/images/image";

export interface ProductInterface {
     idProduct: number;
     brand: Brand;
     category: Category;
     image: Image;
     description: string;
     price: number;
     stock: number;
     characteristics: string;
     model: string;
}
