import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {catchError, map} from 'rxjs/operators';
import {ServiceError, ServiceErrorCode} from '@freshfox/ng-core';


@Injectable()
export class LoggedInGuard implements CanActivate {

	constructor(private authService: AuthService, private router: Router) {
	}

	canActivate() {
		return this.authService.isLoggedIn()
			.pipe(
				map((loggedIn) => {
					if (loggedIn) {
						return true;
					}

					this.router.navigate(['/login']);
					return false;
				}),
				catchError((error: ServiceError) => {
					if (error.code === ServiceErrorCode.ServiceUnavailable) {
						this.router.navigate(['/oops']);
					} else {
						this.router.navigate(['/login']);
					}

					return of(false);
				}));
	}
}
