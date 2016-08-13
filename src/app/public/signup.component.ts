import {Component} from '@angular/core';
import {FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {LoginService} from '../services/login.service';
import {ControlGroup} from '@angular/common';

@Component({
	template: require('./signup.html'),
	providers: [LoginService]
})
export class SignupComponent {

	data = {};
	form: ControlGroup;
	companyName: AbstractControl;
	firstname: AbstractControl;
	lastname: AbstractControl;
	password: AbstractControl;
	email: AbstractControl;

	isSubmitting: boolean = false;

	constructor(private loginService: LoginService) {}

	ngOnInit() {
		/*this.form = this.fb.group({
			company_name: ['', Validators.required],
			email: ['', Validators.required],
			firstname: ['', Validators.required],
			lastname: ['', Validators.required],
			password: ['', Validators.required],
		});

		this.companyName = this.form.controls['company_name'];
		this.firstname = this.form.controls['firstname'];
		this.lastname = this.form.controls['lastname'];
		this.password = this.form.controls['password'];
		this.email = this.form.controls['email'];*/
	}

	onSubmit(): void {
		this.isSubmitting = true;
	}
}
