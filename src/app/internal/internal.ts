import {Component} from '@angular/core';
import {State} from "../core/state";
import {User} from "../models/user";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
	selector: 'nvry-internal',
	template: require('./internal.html')
})
export class InternalComponent {

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
			'key': 'expenses',
			'icon': 'document-text',
			'routerLink': '/expenses',
			'title': 'expenses.title',
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

    private user: User;

    constructor(private state: State) {
        this.user = this.state.user;
    }
}
