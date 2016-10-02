import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../services/login.service";
import {TranslateService} from "ng2-translate";
import {ErrorHandler} from "../core/error-handler";
import {FormValidator} from "../core/form-validator";

@Component({
    templateUrl: 'reset-password.html'
})
export class ResetPasswordComponent implements OnInit {

    form: FormGroup;

    constructor(private authService: AuthService,
                private fb: FormBuilder,
                private translate: TranslateService,
                private errorHandler: ErrorHandler) {

        let password =
        this.form = fb.group({
            'password': ["", Validators.compose([Validators.required, Validators.minLength(6)])],
            'password-repeat': ["", Validators.compose([Validators.required, Validators.minLength(6)])],
        }, { validator: FormValidator.areEqual });
    }

    ngOnInit() { }

}
