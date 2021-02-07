import {Injectable} from '@angular/core';
import {ApiService} from '@freshfox/ng-core';
import {User} from '../models/user';
import {Observable, of} from 'rxjs';
import {State} from '../core/state';
import {map} from 'rxjs/operators';

@Injectable()
export class UserService {

	private pathUser = '/user';
	private pathUserPassword = '/user/password';

	constructor(private apiService: ApiService, private state: State) {

	}

	getOwnUser(): Observable<User> {
		if (this.state.user) {
			return of(this.state.user);
		}

		return this.apiService.get(this.pathUser)
			.pipe(map(data => {
				return data as User;
			}));
	}

	isLoggedIn(): Observable<boolean> {
		return this.getOwnUser()
			.pipe(map(user => {
				return !!user;
			}));
	}

	updateUser(user: User): Observable<User> {
		return this.apiService.patch(this.pathUser, user)
			.pipe(map(user => {
				this.state.user = user;
				return user;
			}));
	}

	updatePassword(password: string, newPassword: string): Observable<any> {
		return this.apiService.put(this.pathUserPassword, {
			password: password,
			new_password: newPassword
		});
	}

}
