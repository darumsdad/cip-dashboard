import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function phoneValidation(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;
       
        if (!value) {
            return null;
        }

        let valid =

            value.length == 14 &&
            value.charAt(0) === '(' &&

            Number.isInteger(parseInt(value.charAt(1))) &&
            Number.isInteger(parseInt(value.charAt(2))) &&
            Number.isInteger(parseInt(value.charAt(3))) &&

            value.charAt(4) === ')' &&
            value.charAt(5) === ' ' &&

            Number.isInteger(parseInt(value.charAt(6))) &&
            Number.isInteger(parseInt(value.charAt(7))) &&
            Number.isInteger(parseInt(value.charAt(8))) &&

            value.charAt(9) === '-' &&

            Number.isInteger(parseInt(value.charAt(10))) &&
            Number.isInteger(parseInt(value.charAt(11))) &&
            Number.isInteger(parseInt(value.charAt(12))) &&
            Number.isInteger(parseInt(value.charAt(13)))

        

        return !valid ? { invalidPhone: true } : null

    }
}