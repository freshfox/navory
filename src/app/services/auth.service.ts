import {Injectable} from "@angular/core";
import {NavoryApi} from "./base.service";
import {Account} from "../models/account";
import {User} from "../models/user";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {State} from "../core/state";
import {UserService} from "./user.service";
import {AnalyticsService} from "./analytics.service";

@Injectable()
export class AuthService extends NavoryApi {

	private pathSignup = '/register';
	private pathLogin = '/auth';
	private pathRequestPasswordReset = '/password/reset';
	private pathResetPassword = '/password/reset';

	constructor(http: Http, private state: State, private userService: UserService, private analytics: AnalyticsService) {
		super(http);
	}

	login(email: string, password: string, remember: boolean): Observable<any> {
		return this.post(this.pathLogin, {
			email: email,
			password: password,
			durable: remember
		}).map(data => {
			let account = data.account as Account;
			let user = data as User;
			this.setLoggedInUser(user);
			return {
				account: account,
				user: user
			};
		});
	}

	logout() {
		return this.delete(this.pathLogin)
			.map(data => {
				this.removeLoggedInUser();
				this.analytics.shutdownIntercom();
				return data;
			});
	}

	isLoggedIn(): Observable<boolean> {
		if (this.state.user) {
			return Observable.of(true);
		}

		return this.userService.getOwnUser()
			.map((user) => {
				this.setLoggedInUser(user);
				return true;
			});
	}

	setLoggedInUser(user: User) {
		this.state.user = user;
		this.analytics.setIntercomUser(user);
	}

	removeLoggedInUser() {
		this.state.user = null;
	}

	requestPasswordReset(email: string) {
		return this.post(this.pathRequestPasswordReset, {
			email: email
		});
	}

	resetPassword(newPassword: string, token: string) {
		return this.patch(this.pathResetPassword, {
			password: newPassword,
			key: token
		});
	}

	signup(data): Observable<User> {
		return this.post(this.pathSignup, {
			company_name: data.company,
			firstname: data.firstname,
			lastname: data.lastname,
			email: data.email,
			password: data.password
		})
			.map(data => {
				let user = data as User;
				this.setLoggedInUser(user);
				return data;
			});
	}

}
