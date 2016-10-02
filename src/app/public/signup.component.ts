import {Component} from '@angular/core';
import {AuthService} from '../services/login.service';

@Component({
	template: require('./signup.html'),
	providers: [AuthService]
})
export class SignupComponent {

	data = {};

	isSubmitting: boolean = false;

	constructor(private loginService: AuthService) {}

	onSubmit(): void {
		this.isSubmitting = true;
	}
}
