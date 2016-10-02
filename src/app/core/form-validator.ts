import {FormControl} from "@angular/forms";
var validator = require('validator');

export class FormValidator {

    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Pflichtfeld',
            'invalidEmailAddress': 'Ungültige E-Mail Adresse',
            'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            'minlength': `Minimum length ${validatorValue.requiredLength}`
        };

        return config[validatorName];
    }

    static email(control: FormControl) {
        let value = control.value;
        if(value && !validator.isEmail(value)) {
            return {
                invalidEmailAddress: true
            };
        }
        return null;
    }

}
