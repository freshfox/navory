import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Account} from "../models/account";
import {User} from "../models/user";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class LoginService extends BaseService {

    private signupUrl = '/register';
    private loginUrl = '/auth';

    constructor(http: Http) {
        super(http);
    }

    login(email: string, password: string, remember: boolean): Observable<any> {
        return this.post(this.loginUrl, {
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

    signup(data) {

    }

}
