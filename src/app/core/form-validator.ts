import {FormControl, FormGroup, AbstractControl, Validators} from "@angular/forms";
import {Config} from "./config";
var validator = require('validator');

export class FormValidator {

    static passwordLength = Validators.minLength(Config.minPasswordLength);

    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Dies ist ein Pflichtfeld',
            'invalidEmailAddress': 'Ungültige E-Mail Adresse',
            'passwordsNotEqual': 'Passwörter stimmen nicht überein.',
            'minlength': `Mindestlänge ${validatorValue.requiredLength} Zeichen`,
            'userWithEmailExists': 'Ein Benutzer mit dieser E-Mail Adresse ist bereits in unserem System vorhanden.'
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

    static matchingPasswords(group: FormGroup) {
        var valid = true;

        var lastVal: string;
        var currentControl: AbstractControl;
        for(let key of Object.keys(group.controls)) {
            currentControl = group.controls[key];
            var val = currentControl.value;
            if(lastVal && val !== lastVal) {
                valid = false;
            }
            lastVal = val;
        }

        if(valid) {
            if(currentControl.errors && currentControl.errors['passwordsNotEqual']) {
                delete currentControl.errors['passwordsNotEqual'];
                currentControl.updateValueAndValidity();
            }
            return null;
        }

        if(!currentControl.errors) {
            return currentControl.setErrors({ passwordsNotEqual: true });
        }

        return null;
    }

}
