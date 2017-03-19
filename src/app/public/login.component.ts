import {Component} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {Router, ActivatedRoute} from "@angular/router";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {TranslateService} from "ng2-translate";
import {ErrorHandler} from "../core/error-handler";
import {FormValidator} from "../core/form-validator";
import {Helpers} from "../core/helpers";
import {Location} from "@angular/common";
import {AlertBarType} from "../core/components/alert-bar.component";


@Component({
	templateUrl: '././login.html',
})
export class LoginComponent {

	loading = false;
	alertMessage: string;
	alertType: AlertBarType;

	form: FormGroup;

	constructor(private loginService: AuthService,
				private router: Router,
				private location: Location,
				private route: ActivatedRoute,
				private fb: FormBuilder,
				private translate: TranslateService,
				private errorHandler: ErrorHandler) {
		this.form = fb.group({
			'email': ["", Validators.compose([Validators.required, FormValidator.email])],
			'password': ["", Validators.required],
			// 'durable': [""]
		});
	}

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			let message = params['message'];
			if (message && message === 'unauthorized') {
				this.alertMessage = this.translate.instant('login.error-session-invalid');
				this.alertType = AlertBarType.Warning;
				this.location.replaceState('/login');
			}
		});
	}

	onSubmit() {
		Helpers.validateAllFields(this.form);
		if (this.form.valid) {
			let data = this.form.value;
			this.loading = true;
			this.loginService.login(data.email, data.password, data.durable)
				.subscribe(
					data => {
						this.router.navigateByUrl('/dashboard');
					},
					error => {
						this.alertType = AlertBarType.Error;
						switch (error.code) {
							case 'UNAUTHORIZED':
								this.alertMessage = this.translate.instant('login.error-wrong-credentials');
								break;
							default:
								this.alertMessage = this.errorHandler.getDefaultErrorMessage(error.code);
						}
						this.loading = false;
					}
				);
		}
	}

}
