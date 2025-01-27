export interface Purchase {
  clienteId: string | null;
  productos: {
    id: string;
    quantity: number;
    price: number;
    brand: string;
  }[];
  fecha: Date;
  total: number;
  productosCargados?: { brand: string; cantidad: number; precio: number }[];
}
