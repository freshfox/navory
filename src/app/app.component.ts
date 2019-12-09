import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../environments/environment";
import {NavoryApi} from "./services/base.service";
import {AuthService} from "./services/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {State} from "./core/state";
import {AnalyticsService} from "./services/analytics.service";
import {Subscription} from "rxjs";
import {filter} from 'rxjs/operators';
import {SwUpdate} from '@angular/service-worker';
import {MatSnackBar} from '@angular/material';

@Component({
	selector: 'nvry-app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

	private routerSubscription: Subscription;

	constructor(private translate: TranslateService,
				private authService: AuthService,
				private state: State,
				private router: Router,
				private swUpdate: SwUpdate,
				private snackbar: MatSnackBar,
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
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(event => {
				document.body.scrollTop = 0;
			});

		if (environment.production && 'serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistration()
				.then(active => !active && navigator.serviceWorker.register('/ngsw-worker.js'))
				.catch(console.error);
		}

		this.initCheckForUpdates();
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

	private initCheckForUpdates() {
		if (this.swUpdate.isEnabled) {
			setInterval(() => {
				console.log('Checking for App Update');
				this.swUpdate.checkForUpdate().then(() => {
					console.log('Checked for update.');
				});
			}, 5 * 60 * 1000);

			this.swUpdate.available.subscribe(() => {
				console.log('An update is available.')
				const title = this.translate.instant('updates.title');
				const button = this.translate.instant('updates.reload');
				const snackBarRef = this.snackbar.open(title, button, {
					horizontalPosition: 'left',
					verticalPosition: 'bottom'
				});

				snackBarRef.onAction().subscribe(() => {
					window.location.reload();
				});
			});
		}
	}
}
