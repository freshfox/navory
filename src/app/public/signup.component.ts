import {Component} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {Helpers} from "../core/helpers";
import {FormValidator} from "../core/form-validator";
import {Router} from "@angular/router";
import {ErrorHandler} from "../core/error-handler";

@Component({
	templateUrl: './signup.component.html'
})
export class SignupComponent {

	private form: FormGroup;
	private loading: boolean = false;
	private alertMessage: string;

	constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private errorHandler: ErrorHandler) {

		this.form = fb.group({
			company: ['', Validators.required],
			firstname: ['', Validators.required],
			lastname: ['', Validators.required],
			email: ['', Validators.compose([Validators.required, FormValidator.email])],
			password: ['', Validators.compose([Validators.required, FormValidator.passwordLength])],
		});
	}

	onSubmit() {
		Helpers.validateAllFields(this.form);
		if (this.form.valid) {
			let data = this.form.value;
			this.loading = true;
			this.authService.signup(data)
				.subscribe(
					() => {
						this.loading = false;
						this.router.navigate(['/']);
					},
					err => {
						this.alertMessage = this.errorHandler.getDefaultErrorMessage(err.code);

						if (err.code == 'VALIDATION_ERROR') {
							let emailErrors: string[] = err.data['email'];
							var controlErrors = {};
							let control: AbstractControl = this.form.controls['email'];

							if (emailErrors.indexOf('NOT_UNIQUE') >= 0) {
								controlErrors['userWithEmailExists'] = true;
							}

							control.setErrors(controlErrors);
						}
					});
		}
	}

}
