import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../models/users/user';
import { RegisterService, User } from '../services/register-service/register.service';
import { EmailService } from '../services/email-service/email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private emailService: EmailService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, lastname, birthdate, address, postalCode, email, password } = this.registerForm.value;
      const nuevoUsuario = new Usuario(name, lastname, new Date(birthdate), address, postalCode, email, password);

      this.registerService.registerUser(nuevoUsuario).subscribe(
        (response) => {
          this.router.navigate(['/']);
          this.sendConfirmationEmail(email);
        },
        (error) => {
          console.error('Error al registrar el usuario:', error);
        }
      );
    }
  }

  sendConfirmationEmail(email: string) {
    const subject = 'Confirmación de registro';
    const message = 'Gracias por registrarte en nuestra aplicación.';
    this.emailService.sendConfirmationEmail(email, subject, message).subscribe(
      (response) => {
        console.log('Correo de confirmación enviado:', response);
      },
      (error) => {
        console.error('Error al enviar el correo:', error);
      }
    );
  }
}
