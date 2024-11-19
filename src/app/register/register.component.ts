import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  RegisterService,
  User,
} from '../services/register-service/register.service';
import { EmailService } from '../services/email-service/email.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/login/auth.service';
import { CustomValidators } from '../common/custom-validators';
import { BsasCity } from '../models/bsas-city';
import { Province } from '../models/province';
import { Usuario } from '../models/users/user';
import { strict } from 'assert';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  provincesList: string[] = Object.values(Province);
  bsasCityList: string[] = Object.values(BsasCity);

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, CustomValidators.lettersOnly()]],
      lastname: ['', [Validators.required, CustomValidators.lettersOnly()]],
      birthdate: [
        '',
        [Validators.required, CustomValidators.ageRangeLimitator(18, 100)],
      ],
      //country: ['Argentina', Validators.required],
      province: [Province.BuenosAires, Validators.required],
      city: [BsasCity.MarDelPlata, Validators.required],
      street: ['', Validators.required],
      streetNumber: ['', [Validators.required, CustomValidators.numbersOnly()]],
      floor: [''],
      flat: [''],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          CustomValidators.emailDomainValidator,
        ],
      ],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const {
        name,
        lastname,
        birthdate,
        province,
        city,
        street,
        streetNumber,
        floor,
        flat,
        email,
        password,
      } = this.registerForm.value;
      const nuevoUsuario: Usuario = {
        name,
        lastname,
        birthdate,
        province,
        city,
        street,
        streetNumber,
        floor,
        flat,
        email,
        password,
      };

      this.registerService.checkEmailExists(email).subscribe(
        (exists) => {
          if (exists) {
            alert('Este correo electrónico ya está registrado.');
          } else {
            this.registerService.registerUser(nuevoUsuario).subscribe(
              (response) => {
                this.authService
                  .login(nuevoUsuario.name, nuevoUsuario.password)
                  .subscribe({
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
}
