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
          return { invalidDomain: true };
        }
      
        return null;
    }
    

}
