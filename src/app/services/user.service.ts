import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {User} from "../models/user";
import {Observable} from "rxjs";

@Injectable()
export class UserService extends BaseService {

    private userMeUrl = '/user';

    constructor(http: Http) {
        super(http);
    }

    getOwnUser(): Observable<User> {
        return this.get(this.userMeUrl)
            .map(data => {
                return data as User;
            });
    }

    isLoggedIn(): Observable<boolean> {
        return this.getOwnUser()
            .map(user => {
                return !!user;
            });
    }

}
