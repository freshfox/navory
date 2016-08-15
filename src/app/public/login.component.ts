import {Component} from '@angular/core';
import {LoginService} from "../services/login.service";
import {Router} from "@angular/router";


@Component({
	template: require('./login.html'),
})
export class LoginComponent {

    login: Login;
    loading = false;

    constructor(private loginService: LoginService, private router: Router) {
        this.login = new Login();
    }

    onSubmit() {
        this.loading = true;
        this.loginService.login(this.login.email, this.login.password, this.login.remember)
            .then(data => {
                this.loading = false;
                this.router.navigateByUrl('/dashboard');
            })
            .catch(err => {
                this.loading = false;
            });

    }

}

class Login {
    email: string;
    password: string;
    remember: boolean = false;
}
