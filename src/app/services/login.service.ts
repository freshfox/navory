import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {Account} from "../models/account";
import {User} from "../models/user";
import {Http} from "@angular/http";

@Injectable()
export class LoginService extends BaseService {

    private signupUrl = '/register';
    private loginUrl = '/auth';

    constructor(http: Http) {
        super(http);
    }

    login(email: string, password: string, remember: boolean): Promise<any> {
        return this.post(this.loginUrl, {
            email: email,
            password: password,
            remember: remember
        }).then(data => {
            let account = data.account as Account;
            let user = data as User;
            return {
                account: account,
                user: user
            };
        }).catch((error: any) => {
            throw error;
        });
    }

    signup(data) {

    }

}
