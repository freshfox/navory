import {Component} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../environments/environment";
import {BaseService} from "./services/base.service";
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {State} from "./core/state";

@Component({
	selector: 'nvry-app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {

	constructor(private translate: TranslateService,
				private authService: AuthService,
				private state: State,
				private router: Router) {
		translate.use('de');

		this.initIntercom();
		this.initUnauthenticatedListener();
	}

	private initIntercom() {
		if(environment.production) {
			(window as any).Intercom("boot", {
				app_id: environment.intercomAppId
			});
		}
	}

	private initUnauthenticatedListener() {
		BaseService.onUnauthorized.subscribe(() => {
			if (this.state.user) {
				this.authService.removeLoggedInUser();
				this.router.navigate(['/login'], {
					queryParams: {message: 'unauthorized'}
				});
			}
		});
	}
}
