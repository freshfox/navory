import {AfterViewInit, Component, OnDestroy} from "@angular/core";
import {State} from "../core/state";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import * as moment from "moment";
import {AnalyticsEventType, AnalyticsService} from "../services/analytics.service";

declare let Headway: any;

@Component({
	templateUrl: './internal.component.html'
})
export class InternalComponent implements AfterViewInit, OnDestroy {

	navItems = [
		{
			'key': 'dashboard',
			'icon': 'home-outline',
			'routerLink': '/dashboard',
			'title': 'dashboard.title',
		},
		{
			'key': 'income',
			'icon': 'document-text',
			'routerLink': '/income',
			'title': 'income.title',
		},
		{
			'key': 'quotes',
			'icon': 'document-text',
			'routerLink': '/quotes',
			'title': 'quotes.title',
		},
		{
			'key': 'expenses',
			'icon': 'document-text',
			'routerLink': '/expenses',
			'title': 'expenses.title',
		},
		{
			'key': 'payments',
			'icon': 'credit-card',
			'routerLink': '/payments',
			'title': 'payments.title',
		},
		{
			'key': 'reports',
			'icon': 'chart-line-outline',
			'routerLink': '/reports',
			'title': 'reports.title',
		},
		{
			'key': 'customers',
			'icon': 'group-outline',
			'routerLink': '/customers',
			'title': 'customers.title',
		},
		{
			'key': 'settings',
			'icon': 'cog-outline',
			'routerLink': '/settings',
			'title': 'settings.title',
		},
	];

	loggingOut: boolean = false;
	notificationOptions = {
		position: ["top", "right"],
		timeOut: 5000,
		showProgressBar: false,
		maxStack: 4
	}

	constructor(public state: State, private authService: AuthService, private router: Router, private route: ActivatedRoute, private analytics: AnalyticsService) {
		let bootstrap = this.route.snapshot.data['bootstrap'];
		Object.assign(this.state, bootstrap);
		this.state.expenseCategories = bootstrap.categories;
	}

	ngAfterViewInit() {
		this.initHeadway();
	}

	ngOnDestroy() {
		this.destroyHeadway();
	}

	initHeadway() {
		if (Headway) {
			let config = {
				selector: ".whats-new-badge",
				account: "JP3nD7",
				translations: {
					title: "Updates",
					readMore: "Mehr",
					labels: {
						"new": "Neu",
						"improvement": "Updates",
						"fix": "Bugfix"
					}
				}
			};
			Headway.init(config);
		}
	}

	destroyHeadway() {
		if (Headway) {
			Headway.destroy();
		}
	}

	logout() {
		this.loggingOut = true;
		this.authService.logout()
			.subscribe(() => {
				this.loggingOut = false;
				this.router.navigate(['/login']);
			});
	}
}
