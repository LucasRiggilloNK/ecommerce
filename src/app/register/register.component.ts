import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../models/users/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, lastname, birthdate, address, postalCode, email } = this.registerForm.value;
      const nuevoUsuario = new Usuario(name, lastname, new Date(birthdate), address, postalCode, email);
      console.log('Usuario registrado:', nuevoUsuario);
      // Aquí puedes enviar nuevoUsuario al backend
    }
  }
}
