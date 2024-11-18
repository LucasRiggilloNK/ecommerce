import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {

    static lettersOnly(): ValidatorFn {
        let regExp: RegExp = /^[a-zA-Z\s]*$/;

        return (control: AbstractControl): {[key: string]: any} | null => {                     
            const lettersOnly = regExp.test(control.value);

            return !lettersOnly ? { 'lettersOnly': {value: control.value} } : null;
        };
    }

    static numbersOnly(): ValidatorFn {
        let regExp: RegExp = /^[0-9\s]*$/;

        return (control: AbstractControl): {[key: string]: any} | null => {                     
            const lettersOnly = regExp.test(control.value);

            return !lettersOnly ? { 'numbersOnly': {value: control.value} } : null;
        };
    }

    static emailDomainValidator(control: AbstractControl): ValidationErrors | null {// Valida que el dominio sea servidor o .com.ar o .com
        const email = control.value;
        const emailRegex = /^[^@]+@[^@]+.[a-zA-Z]{2,}$/;
        if (email && !emailRegex.test(email)) {
          return { emailDomainValidator: true };
        }
      
        return null;
    }
    
    static ageRangeLimitator(minAge: number, maxAge: number) {
        return (control: AbstractControl): ValidationErrors | null => {
          const birthdate = new Date(control.value);
          const today = new Date();
          
          // Calcula la edad inclusive verificando el mes y el día
          const age = today.getFullYear() - birthdate.getFullYear();
          const monthDifference = today.getMonth() - birthdate.getMonth();
          const dayDifference = today.getDate() - birthdate.getDate();
    
          // Ajustar edad si el mes o día no ha pasado
          const adjustedAge = monthDifference < 0 || (monthDifference === 0 && dayDifference < 0) ? age - 1 : age;
    
          // Validar que se cumpla rango de edades pasado por parámetro
          if (adjustedAge < minAge || adjustedAge > maxAge) {
            return { ageRangeLimitator: true }; // Error
          }
    
          return null; // Válido
        };
    }

}
