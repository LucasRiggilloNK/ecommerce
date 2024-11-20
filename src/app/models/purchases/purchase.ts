export interface Purchase {
  clienteId: string | null;
  productos: {
    id: string;
    quantity: number;
  }[];
  fecha: Date;
  total: number;
}
