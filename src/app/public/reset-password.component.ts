import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ErrorHandler} from "../core/error-handler";
import {FormValidator} from "../core/form-validator";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Config} from "../core/config";
import {Helpers} from "../core/helpers";
import {TranslateService} from "ng2-translate";

@Component({
    templateUrl: 'reset-password.html'
})
export class ResetPasswordComponent implements OnInit {

    form: FormGroup;
    token: string;
    alertMessage: string;
    alertType: string;
    loading = false;
    finished = false;

    constructor(private authService: AuthService,
                private fb: FormBuilder,
                private errorHandler: ErrorHandler,
                private route: ActivatedRoute,
                private config: Config,
                private translate: TranslateService,
                private router: Router) {

        let passwordValidators = Validators.compose([Validators.required, FormValidator.passwordLength]);
        this.form = fb.group({
            'password': ["", passwordValidators],
            'passwordRepeat': ["", passwordValidators],
        }, { validator: FormValidator.matchingPasswords });
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
           this.token = params['token'];
        });
    }

    onSubmit() {
        Helpers.validateAllFields(this.form);
        if(this.form.valid) {
            this.loading = true;
            let data = this.form.value;
            this.authService.resetPassword(data.password, this.token)
                .subscribe(() => {
                    this.alertMessage = this.translate.instant('login.reset-password.success-message');
                    this.alertType = 'success';
                    this.loading = false;
                    this.finished = true;
                },
                error => {
                    switch(error.code) {
                        case 'VALIDATION_ERROR':
                            this.alertMessage = this.translate.instant('login.reset-password.invalid-key-error');
                            break;
                        default:
                            this.alertMessage = this.errorHandler.getDefaultErrorMessage(error.code);
                    }
                    this.loading = false;
                });
        }
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }

}
