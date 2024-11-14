import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { PurchaseService } from '../../services/purchase-service/purchase-service.service';
import { Purchase } from '../../models/purchases/purchase';

@Component({
  selector: 'app-purchase',
  templateUrl: './buy-form.Component.html'
})
export class PurchaseComponent {
  compraForm: FormGroup;

  constructor(private fb: FormBuilder, private purchaseService: PurchaseService) {
    this.compraForm = this.fb.group({
      clienteId: [''],
      productos: this.fb.array([])
    });
  }

  get productos(): FormArray {
    return this.compraForm.get('productos') as FormArray;
  }

  agregarProducto() {
    this.productos.push(this.fb.group({
      productoId: [''],
      cantidad: ['']
    }));
  }

  onSubmit() {
    const nuevaCompra: Purchase = {
      clienteId: this.compraForm.value.clienteId,
      productos: this.compraForm.value.productos,
      fecha: new Date().toISOString()
    };

    this.purchaseService.agregarCompra(nuevaCompra).subscribe(response => {
      console.log('Compra registrada con éxito:', response);
    }, error => {
      console.error('Error al registrar la compra:', error);
    });
  }
}
