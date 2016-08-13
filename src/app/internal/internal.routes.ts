import {Routes} from '@angular/router';
import {CustomersComponent} from './customers/customers.component';
import {InternalComponent} from './internal';
import {DashboardComponent} from './dashboard/dashboard.component';

export const InternalRoutes: Routes = [
	{
		path: '',
		component: InternalComponent,
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'customers',  component: CustomersComponent },
		]
	}
];
