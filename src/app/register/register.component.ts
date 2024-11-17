import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService, User } from '../services/register-service/register.service';
import { EmailService } from '../services/email-service/email.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/login/auth.service';
import { CustomValidators } from '../common/custom-validators';

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
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, CustomValidators.lettersOnly()]],
      lastname: ['', [Validators.required, CustomValidators.lettersOnly()]],
      birthdate: ['',[Validators.required, CustomValidators.ageRangeLimitator(18, 100)]],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, CustomValidators.emailDomainValidator]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, lastname, birthdate, address, postalCode, email, password } = this.registerForm.value;
      const nuevoUsuario: User = { name, lastname, birthdate, address, postalCode, email, password };

      this.registerService.checkEmailExists(email).subscribe(
        (exists) => {
          if (exists) {
            alert('Este correo electrónico ya está registrado.');
          } else {
            this.registerService.registerUser(nuevoUsuario).subscribe(
              (response) => {
                /* this.router.navigate(['/']); */
                //this.sendConfirmationEmail(email); 
                this.authService.login(nuevoUsuario.name, nuevoUsuario.password).subscribe({
                  next: (success) => {
                    if (success) {
                      this.router.navigate(['/']);
                    }
                  },
                  error: (error) => {
                    console.error(error);
                  },
                });
              },
              (error) => {
                console.error('Error al registrar el usuario:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error al verificar el correo:', error);
        }
      );
    }
  }


/*   sendConfirmationEmail(email: string) {
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
  } */
}
