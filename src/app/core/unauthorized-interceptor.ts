import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {State} from './state';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

	constructor(private state: State, private authService: AuthService, private router: Router) {

	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const reqClone = req.clone({
			withCredentials: true,
		});

		return next.handle(reqClone)
			.pipe(catchError((error) => {
				if (error instanceof HttpErrorResponse) {
					switch ((error as HttpErrorResponse).status) {
						case 401:
							if (this.state.user) {
								this.authService.removeLoggedInUser();
								this.router.navigate(['/login'], {
									queryParams: {message: 'unauthorized'}
								});
							}
					}
				}

				return throwError(error);
			}));
	}

}
