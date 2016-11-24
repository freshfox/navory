import {FormControl, FormGroup, AbstractControl, Validators, ValidatorFn} from "@angular/forms";
import {Config} from "./config";
import * as moment from "moment";
var validator = require('validator');

export class FormValidator {

    static passwordLength: ValidatorFn = Validators.minLength(Config.minPasswordLength);

    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Dies ist ein Pflichtfeld',
            'invalidEmailAddress': 'Ungültige E-Mail Adresse',
            'passwordsNotEqual': 'Passwörter stimmen nicht überein.',
            'minlength': `Mindestlänge ${validatorValue.requiredLength} Zeichen`,
            'invalidDate': 'Bitte gib ein korrektes Datum ein',
            'userWithEmailExists': 'Ein Benutzer mit dieser E-Mail Adresse ist bereits in unserem System vorhanden.',
            'notNumeric': 'Bitte gib eine Zahl ein',
            numberNotUnique: 'Diese Nummer ist bereits belegt.'
        };

        return config[validatorName] || 'No error message for type ' + validatorName;
    }

    static getPasswordValidators(): ValidatorFn {
        return Validators.compose([Validators.required, FormValidator.passwordLength]);
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

    static date(control: FormControl) {
        let value = control.value;
        let date = moment(value);
        if(!date.isValid()) {
            return {
                invalidDate: true
            };
        }

        return null;
    }

    static number(control: FormControl) {
        var value = control.value;
        if(value) {
            value = `${value}`;
            if(!FormValidator.isNumeric(value)) {
                return {
                    notNumeric: true
                };
            }
        }

        return null;
    }

    static isNumeric(value: string) {
        return validator.isNumeric(value);
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
