import {Injectable} from '@angular/core';
import {Account} from '../models/account';
import {User} from '../models/user';
import {ApiService} from '@freshfox/ng-core';
import {Observable, of} from 'rxjs';
import {State} from '../core/state';
import {UserService} from './user.service';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthService {

	private pathSignup = '/register';
	private pathLogin = '/auth';
	private pathRequestPasswordReset = '/password/reset';
	private pathResetPassword = '/password/reset';

	constructor(private apiService: ApiService, private state: State, private userService: UserService) {

	}

	login(email: string, password: string, remember: boolean): Observable<any> {
		return this.apiService.post(this.pathLogin, {
			email: email,
			password: password,
			durable: remember
		}).pipe(map(data => {
			let account = data.account as Account;
			let user = data as User;
			this.setLoggedInUser(user);
			return {
				account: account,
				user: user
			};
		}));
	}

	logout() {
		return this.apiService.delete(this.pathLogin)
			.pipe(map(data => {
				this.removeLoggedInUser();
				return data;
			}));
	}

	isLoggedIn(): Observable<boolean> {
		if (this.state.user) {
			return of(true);
		}

		return this.userService.getOwnUser()
			.pipe(map((user) => {
				this.setLoggedInUser(user);
				return true;
			}));
	}

	setLoggedInUser(user: User) {
		this.state.user = user;
	}

	removeLoggedInUser() {
		this.state.user = null;
	}

	requestPasswordReset(email: string) {
		return this.apiService.post(this.pathRequestPasswordReset, {
			email: email
		});
	}

	resetPassword(newPassword: string, token: string) {
		return this.apiService.patch(this.pathResetPassword, {
			password: newPassword,
			key: token
		});
	}

	signup(data): Observable<User> {
		return this.apiService.post(this.pathSignup, {
			company_name: data.company,
			firstname: data.firstname,
			lastname: data.lastname,
			email: data.email,
			password: data.password
		})
			.pipe(map(data => {
				let user = data as User;
				this.setLoggedInUser(user);
				return data;
			}));
	}

}
