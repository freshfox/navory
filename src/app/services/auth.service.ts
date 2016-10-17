import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Account} from "../models/account";
import {User} from "../models/user";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {State} from "../core/state";

@Injectable()
export class AuthService extends BaseService {

    private pathSignup = '/register';
    private pathLogin = '/auth';
    private pathRequestPasswordReset = '/password/reset';
    private pathResetPassword = '/password/reset';

    constructor(http: Http, private state: State) {
        super(http);
    }

    login(email: string, password: string, remember: boolean): Observable<any> {
        return this.post(this.pathLogin, {
            email: email,
            password: password,
            remember: remember
        }).map(data => {
            let account = data.account as Account;
            let user = data as User;
            this.setLoggedInUser(user);
            return {
                account: account,
                user: user
            };
        });
    }

    logout() {
        return this.delete(this.pathLogin)
            .map(data => {
                this.removeLoggedInUser();
                return data;
            });
    }

    setLoggedInUser(user: User) {
        this.state.user = user;
    }

    removeLoggedInUser() {
        this.state.user = null;
    }

    requestPasswordReset(email: string) {
        return this.post(this.pathRequestPasswordReset, {
            email: email
        });
    }

    resetPassword(newPassword: string, token: string) {
        return this.patch(this.pathResetPassword, {
            password: newPassword,
            key: token
        });
    }

    signup(data): Observable<User> {
        return this.post(this.pathSignup, {
            company_name: data.company,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: data.password
        })
            .map(data => {
                let user = data as User;
                this.setLoggedInUser(user);
                return data;
            });
    }

}