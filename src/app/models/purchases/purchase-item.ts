import { ProductInterface2 } from "../../interfaces/product/product-interface2";

export interface PurchaseItem {
    id: string;
    description: string;
    cantidad: Number;
    producto: ProductInterface2;
}
