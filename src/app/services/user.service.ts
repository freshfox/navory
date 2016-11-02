import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {User} from "../models/user";
import {Observable} from "rxjs";
import {State} from "../core/state";

@Injectable()
export class UserService extends BaseService {

    private pathUser = '/user';
    private pathUserPassword = '/user/password';

    constructor(http: Http, private state: State) {
        super(http);
    }

    getOwnUser(): Observable<User> {
        if (this.state.user) {
            return Observable.of(this.state.user);
        }

        return this.get(this.pathUser)
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

    updateUser(user: User): Observable<User> {
        return this.patch(this.pathUser, user)
            .map(user => {
                this.state.user = user;
                return user;
            });
    }

    updatePassword(password: string, newPassword: string): Observable<any> {
        return this.put(this.pathUserPassword, {
            password: password,
            new_password: newPassword
        });
    }

}
