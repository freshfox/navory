import { Component } from '@angular/core';
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {ErrorHandler} from "../core/error-handler";
import {TranslateService} from "ng2-translate";
import {AuthService} from "../services/login.service";
import {FormValidator} from "../core/form-validator";

@Component({
    templateUrl: 'forgot-password.html'
})
export class ForgotPasswordComponent {

    loading = false;
    alertMessage: string;
    alertType: string;

    form: FormGroup;

    constructor(private loginService: AuthService,
                private fb: FormBuilder,
                private translate: TranslateService,
                private errorHandler: ErrorHandler) {
        this.form = fb.group({
            'email': ["", Validators.compose([Validators.required, FormValidator.email])],
        });
    }

    onSubmit() {
        if(this.form.valid) {
            let data = this.form.value;
            this.loading = true;
            this.loginService.requestPasswordReset(data.email)
                .subscribe(
                    data => {
                        this.alertMessage = this.translate.instant('login.forgot-password.success-message');
                        this.alertType = 'success';
                        this.loading = false;
                    },
                    error => {
                        switch(error.code) {
                            default:
                                this.alertMessage = this.errorHandler.getDefaultErrorMessage(error.code);
                        }
                        this.loading = false;
                    }
                );
        }
    }

}
