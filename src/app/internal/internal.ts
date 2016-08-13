import {Component} from '@angular/core';

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
}
