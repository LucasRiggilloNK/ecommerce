export interface Purchase {
  clienteId: string;
  productos: {
    productoId: number;
    cantidad: number;
  }[];
  fecha: string;
}
