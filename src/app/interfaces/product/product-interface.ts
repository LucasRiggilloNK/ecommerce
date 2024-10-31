import { Brand } from "../../models/products/brands/brand";
import { Category } from "../../models/products/categories/category";
import { Image } from "../../models/products/images/image";

export interface ProductInterface {
     id: number;
     brand: string;
     category: string;
     urlImage: string;
     description: string;
     price: number;
     stock: number;
     characteristics: string;
     model: string;
}
