import { Pipe, PipeTransform } from "@angular/core";
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

@Pipe({
    name: 'emailToClass',
    pure: true
})
export class EmailStatusPipe implements PipeTransform {

    transform(emails: any, args?: any): any {
        return this.emailToClass(emails);
    }
    emailToClass(emails: any): String {

        if (emails.length == 0) {
            return 'header'
        } else {

            let last = emails[emails.length - 1]
            let status = last.status;
            let last_status = status[status.length - 1].event

            if (last_status.includes('bounce')) {
                return 'header error'
            } else {
                return 'header'
            }
        }
    }
}

@Pipe({
    name: 'emailToStatus',
    pure: true
})
export class EmailOverallStatusPipe implements PipeTransform {

    transform(emails: any, ...args: any[]) {

        let clazz: any = 'red'

        if (emails.length == 0) {
            return {
                text: 'Email not yet sent',
                class: clazz
            }
        }
        else {
            clazz = 'blue'
            let last = emails[emails.length - 1]
            let status = last.status;
            let last_status = status[status.length - 1].event

            if (last_status === 'sent') {
                last_status = "Email created"
            } else if (last_status === 'request') {
                last_status = "Email sent"
            } else if (last_status === 'delivered') {
                last_status = "Email delivered"
            } else if (last_status === 'unique_opened') {
                last_status = "Email opened"
            } else if (last_status === 'click') {
                last_status = "Link clicked by recipient"
            } else if (last_status.includes('bounce')) {
                last_status = "Email Bounced!!"
            }

            return {
                text: last_status,
                class: clazz
            }
        }
    }
}