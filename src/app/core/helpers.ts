import {FormGroup} from "@angular/forms";

export class Helpers {

    static validateAllFields(formGroup: FormGroup) {
        for (var i in formGroup.controls) {
            var control = formGroup.controls[i];
            control.markAsTouched();

            if(control instanceof FormGroup) {
                Helpers.validateAllFields(<FormGroup>control);
            }
        }
    }
}
