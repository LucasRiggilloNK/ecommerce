import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/login/auth.service';
import { RegisterService, User } from '../../services/register-service/register.service';
import { PurchaseService } from '../../services/purchase-service/purchase-service.service';
import { Purchase } from '../../models/purchases/purchase';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  user: User = {
    name: '',
    lastname: '',
    birthdate: new Date(),
    province: '',
    city: '',
    street: '',
    streetNumber: '',
    floor: '',
    flat: '',
    email: '',
    password: ''
  };

  purchases: Purchase[] = [];  

  profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private registerService: RegisterService,
    private purchaseService: PurchaseService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      birthdate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      streetNumber: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userId: string | null = this.authService.getUserId();
    if (!userId) {
      console.warn('No se encontró un ID de usuario en la sesión.');
      return;
    }

    console.log('Obteniendo datos del usuario con ID:', userId);

    // Obtener datos del usuario
    this.registerService.getUserById(userId).subscribe({
      next: (response) => {
        this.user = response;
        this.profileForm.patchValue(this.user); // Actualiza el formulario con los datos del usuario
        console.log('Datos del usuario cargados:', this.user);
      },
      error: (error) => {
        console.error(`Error al obtener usuario con ID ${userId}:`, error);
      },
    });

    // Obtener compras del usuario
    this.purchaseService.obtenerComprasPorCliente(userId).subscribe({
      next: (response) => {
        this.purchases = response;
        console.log('Compras del usuario:', this.purchases);
      },
      error: (error) => {
        console.error(`Error al obtener compras del usuario con ID ${userId}:`, error);
      },
    });
  }

  openEditModal(userData: any) {
    this.user = { ...userData };  // Clona los datos del usuario a la variable local
    this.profileForm.patchValue(this.user); // Actualiza el formulario con los datos del usuario

    setTimeout(() => {
      this.cd.detectChanges(); // Fuerza la actualización del DOM de Angular
    }, 0);
  }
  /*
  saveProfile() {
    if (this.profileForm.valid) {
      const updatedUser = { ...this.user, ...this.profileForm.value };

      console.log("Guardando cambios...", updatedUser);

      this.registerService.updateUser(updatedUser).subscribe({
        next: (response) => {
          console.log("Usuario actualizado con éxito:", response);

          // Mostrar el Toast de éxito
          this.showToast();

          // Cerrar el modal automáticamente
          const modal = document.getElementById('editProfileModal') as any;
          if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();  // Cerrar el modal
          }
        },
        error: (error) => {
          console.error("Error al actualizar usuario:", error);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  // Función para mostrar el Toast
  showToast() {
    const toastElement = document.getElementById('successToast') as any;
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();  // Mostrar el toast
    }
  } 
  */
  changePassword() {
    console.log("Contraseña cambiada correctamente...");
    // Aquí puedes agregar lógica para actualizar la contraseña
  }

  deleteAccount() {
    console.log("Cuenta eliminada...");
    // Aquí puedes agregar lógica para eliminar la cuenta del usuario
  }

  saveAddress() {
    console.log("Dirección guardada...");
    // Aquí puedes agregar lógica para agregar una nueva dirección de envío
  }

  deleteAddress() {
    console.log("Dirección eliminada...");
    // Aquí puedes agregar lógica para eliminar una dirección de envío
  }
}
