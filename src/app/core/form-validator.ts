import {FormControl, FormGroup} from "@angular/forms";
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

    static areEqual(group: FormGroup) {
        var valid = false;

        var firstVal: string;
        for(let control of group.controls) {
            var val = control.value;
            if(firstVal && val === firstVal) {
                continue;
            }
            firstVal = val;
        }

        if(valid) {
            return null;
        }

        return {
            notEqual: true
        };
    }

}
