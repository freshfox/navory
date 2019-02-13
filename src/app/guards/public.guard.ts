import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class PublicGuard implements CanActivate {

	constructor(private authService: AuthService, private router: Router) {
	}

	canActivate() {
		return this.authService.isLoggedIn()
			.pipe(map((loggedIn) => {
				if (loggedIn) {
					this.router.navigate(['/']);
					return false;
				}
			}), catchError(err => {
				return of(true);
			}));
	}

}
