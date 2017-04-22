import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs";

@Injectable()
export class PublicGuard implements CanActivate {

	constructor(private authService: AuthService, private router: Router) {
	}

	canActivate() {
		return this.authService.isLoggedIn()
			.map((loggedIn) => {
				if (loggedIn) {
					this.router.navigate(['/']);
					return false;
				}
			}).catch(err => {
				return Observable.of(true);
			});
	}

}
