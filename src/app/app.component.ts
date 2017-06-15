import {Component} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../environments/environment";
import {NavoryApi} from "./services/base.service";
import {AuthService} from "./services/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {State} from "./core/state";
import {AnalyticsService} from "./services/analytics.service";
import {Subscription} from "rxjs/Subscription";

@Component({
	selector: 'nvry-app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {

	private routerSubscription: Subscription;

	constructor(private translate: TranslateService,
				private authService: AuthService,
				private state: State,
				private router: Router,
				private analyticsService: AnalyticsService) {
		translate.use('de');

		this.initAnalytics();
		this.initUnauthenticatedListener();
	}

	ngOnInit() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.analyticsService.trackPageView();
			}
		});

		this.routerSubscription = this.router.events
			.filter(event => event instanceof NavigationEnd)
			.subscribe(event => {
				document.body.scrollTop = 0;
			});
	}

	ngOnDestroy() {
		this.routerSubscription.unsubscribe();
	}

	private initAnalytics() {
		if(environment.production) {
			this.analyticsService.initIntercom(environment.intercomAppId);
		}
	}

	private initUnauthenticatedListener() {
		NavoryApi.onUnauthorized.subscribe(() => {
			if (this.state.user) {
				this.authService.removeLoggedInUser();
				this.router.navigate(['/login'], {
					queryParams: {message: 'unauthorized'}
				});
			}
		});
	}
}
