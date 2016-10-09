import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Account} from "../models/account";
import {User} from "../models/user";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class AuthService extends BaseService {

    private pathSignup = '/register';
    private pathLogin = '/auth';
    private pathRequestPasswordReset = '/password/reset';
    private pathResetPassword = '/password/reset';

    constructor(http: Http) {
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
            return {
                account: account,
                user: user
            };
        });
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

    signup(data) {

    }

}
