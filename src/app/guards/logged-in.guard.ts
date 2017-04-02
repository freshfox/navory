import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";
import {ServiceError, ServiceErrorCode} from "../services/base.service";


@Injectable()
export class LoggedInGuard implements CanActivate {

	constructor(private authService: AuthService, private router: Router) {
	}

	canActivate() {
		return this.authService.isLoggedIn()
			.map((loggedIn) => {
				if (loggedIn) {
					return true;
				}

				this.router.navigate(['/login']);
				return false;
			}).catch((error: ServiceError) => {
				if (error.code === ServiceErrorCode.ServiceUnavailable) {
					this.router.navigate(['/oops']);
				} else {
					this.router.navigate(['/login']);
				}

				return Observable.of(false);
			});
	}
}
