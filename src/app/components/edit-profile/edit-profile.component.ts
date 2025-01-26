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
  changePasswordForm: FormGroup;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

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
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: CustomValidators.samePasswordValidator });
  }
  
  ngOnInit(): void {
    
    const userId: string | null = this.authService.getUserId();
    if (!userId) {
      console.warn('No se encontró un ID de usuario en la sesión.');
      return;
    }

    
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
          this.showToast("Perfil actualizado correctamente.", "success");
          this.closeModal('editProfileModal', 'success');
        },
        error: (error) => {
          this.showToast("Error al actualizar perfil.", "error");
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
  
  changePassword() {
    if (this.changePasswordForm.invalid) {
      this.showToast("Por favor, complete todos los campos correctamente.", "error");
      return;
    }
    const { currentPassword, newPassword } = this.changePasswordForm.value;
    if (currentPassword !== this.user.password) {
      this.showToast("La contraseña actual es incorrecta.", "error");
      return;
    }
    if (newPassword === currentPassword) {
      this.showToast("La nueva contraseña no puede ser igual a la anterior.", "error");
      return;
    }
    const updatedUser = { ...this.user, password: newPassword };
    this.registerService.updateUser(updatedUser).subscribe({
      next: () => {
        this.user.password = newPassword;
        this.showToast("Contraseña actualizada correctamente.", "success");
        this.closeModal('changePasswordModal', 'success');
      },
      error: () => {
        this.showToast("Error al actualizar la contraseña.", "error");
      }
    });
  }
  

  saveAddress() {
    console.log("Dirección guardada...");
    // Aquí puedes agregar lógica para agregar una nueva dirección de envío
  }





  showToast(message: string, type: 'success' | 'error') {
    const toastContainer = document.getElementById('genericToastContainer');
  
    if (toastContainer) {
      toastContainer.innerHTML = `
        <div class="toast align-items-center text-bg-${type === 'success' ? 'success' : 'danger'} border-0" role="alert">
          <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      `;
      
      const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
      toast.show();
    }
  }
  closeModal (modalName: string, type: 'success' | 'error'){
    const modal = document.getElementById(modalName) as any;
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();  
      document.body.classList.remove('modal-open'); 
    }
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
