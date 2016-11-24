import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserService} from "../services/user.service";
import {User} from "../models/user";
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";
import {ServiceError, ServiceErrorCode} from "../services/base.service";


@Injectable()
export class LoggedInGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router, private authService: AuthService) {
    }

    canActivate() {
        return this.userService.getOwnUser()
            .map((user: User) => {
                if (user) {
                    this.authService.setLoggedInUser(user);
                    return true;
                }
            }).catch((error: ServiceError) => {
                if(error.code === ServiceErrorCode.ServiceUnavailable) {
                    this.router.navigate(['/oops']);
                } else {
                    this.router.navigate(['/login']);
                }

                return Observable.of(false);
            });
    }
}
