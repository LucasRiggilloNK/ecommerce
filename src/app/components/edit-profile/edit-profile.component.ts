declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/login/auth.service';
import { RegisterService, User } from '../../services/register-service/register.service';
import { PurchaseService } from '../../services/purchase-service/purchase-service.service';
import { Purchase } from '../../models/purchases/purchase';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CustomValidators } from '../../common/custom-validators';
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
      name: ['', [Validators.required, CustomValidators.lettersOnly()]], 
      lastname: ['', [Validators.required, CustomValidators.lettersOnly()]],
      birthdate: ['', [Validators.required, CustomValidators.ageRangeLimitator(18, 100)]], 
      email: ['', [Validators.required, Validators.email, CustomValidators.emailDomainValidator]],
      street: ['', Validators.required],
      streetNumber: ['', [Validators.required, CustomValidators.numbersOnly()]],
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

    
    this.registerService.getUserById(userId).subscribe({
      next: (response) => {
        this.user = response;
        this.profileForm.patchValue(this.user); 
        console.log('Datos del usuario cargados:', this.user);
      },
      error: (error) => {
        console.error(`Error al obtener usuario con ID ${userId}:`, error);
      }
    });

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
    this.user = { ...userData };  
    this.profileForm.patchValue(this.user); 

    setTimeout(() => {
      this.cd.detectChanges(); 
    }, 0);
  }
 
  saveProfile() {
    if (this.profileForm.valid) {
      const updatedUser = { ...this.user, ...this.profileForm.value };
  
      console.log("Guardando cambios...", updatedUser);
  
      this.registerService.updateUser(updatedUser).subscribe({
        next: (response) => {
          this.user = { ...updatedUser }; 
          this.profileForm.patchValue(updatedUser); 
          this.showToast();
          const modal = document.getElementById('editProfileModal') as any;
          if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();  
            document.body.classList.remove('modal-open'); 
          }
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
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
  
  showToast() {
    const toastElement = document.getElementById('successToast') as any;
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();  
    }
  } 
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
