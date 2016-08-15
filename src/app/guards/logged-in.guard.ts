import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserService} from "../services/user.service";
import {State} from "../core/state";
import {User} from "../models/user";
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs";


@Injectable()
export class LoggedInGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router, private state: State) {
    }

    canActivate() {
        return this.userService.getOwnUser().map((user: User) => {
            console.log(user);
            if(user) {
                this.state.user = user;
                return true;
            }
        }).catch(res => {
            this.router.navigate(['/login']);
            return Observable.of(false);
        });
    }
}
