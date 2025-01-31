import { ProductInterface2 } from "../../interfaces/product/product-interface2";
import { PurchaseItem } from "./purchase-item";

export interface Purchase {
  purchaseId: number; 
  clienteId: string | null;
  productos: {
    id: string;
    quantity: number;
    price: number;
    brand: string;
    model: string;
  }[];
  fecha: Date;
  total: number;
  productosCargados?: { cantidad: number; precio: number; brand: string }[];
  /* purchaseId: number; 
  clienteId: string | null;
  productos: PurchaseItem[];
  fecha: Date;
  total: number;
  discount: Number;
  productosCargados?: { cantidad: number; precio: number; brand: string }[]; */

}
