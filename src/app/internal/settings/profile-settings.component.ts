import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormValidator} from "../../core/form-validator";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {NotificationsService} from "angular2-notifications";
import {TranslateService} from "ng2-translate";
import {Helpers} from "../../core/helpers";
import {State} from "../../core/state";

@Component({
	templateUrl: './profile-settings.component.html'
})
export class ProfileSettingsComponent implements OnInit {

	user: User;
	form: FormGroup;
	passwordForm: FormGroup;
	newPasswordsGroup: FormGroup;

	saving: boolean = false;
	savingPassword: boolean = false;

	constructor(private fb: FormBuilder,
				private userService: UserService,
				private notificationService: NotificationsService,
				private translate: TranslateService,
				private state: State) {

		this.userService.getOwnUser()
			.subscribe(user => {
				this.user = user;
			});

		this.form = this.fb.group({
			firstname: ["", Validators.required],
			lastname: ["", Validators.required],
			email: ["", Validators.compose([Validators.required, FormValidator.email])],
		});


		let passwordValidators = FormValidator.getPasswordValidators();
		this.passwordForm = this.fb.group({
			password: ["", Validators.required],
			new_passwords: this.fb.group({
				new_password: ["", passwordValidators],
				new_password_confirmation: ["", passwordValidators],
			}, {validator: FormValidator.matchingPasswords})
		});

		this.newPasswordsGroup = this.passwordForm.controls.new_passwords as FormGroup;
	}

	ngOnInit() {
	}


	saveUser() {
		if (this.form.valid) {
			this.saving = true;
			let user = this.form.value;
			this.userService.updateUser(user)
				.subscribe(user => {
						this.user = user;
						this.state.user = user;
						this.saving = false;
						this.notificationService.success(null, this.translate.instant('settings.profile.success-message'));
					},
					error => {
						this.saving = true;
					});
		}
	}

	savePassword() {
		Helpers.validateAllFields(this.passwordForm);
		if (this.passwordForm.valid) {
			this.savingPassword = true;
			let data = this.passwordForm.value;
			this.userService.updatePassword(data.password, data.new_passwords.new_password)
				.subscribe(
					() => {
						this.savingPassword = false;
						this.notificationService.success(null, this.translate.instant('settings.change-password.success-message'));
						this.passwordForm.reset();
					},
					error => {
						if (error.data.password[0] == 'INVALID') {
							this.notificationService.error(null, this.translate.instant('settings.change-password.errors.incorrect-password'));
							this.passwordForm.controls['password'].reset();
						}
						this.savingPassword = false;
					});
		}
	}
}
