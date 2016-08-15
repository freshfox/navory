import {Routes} from '@angular/router';
import {CustomersComponent} from './customers/customers.component';
import {InternalComponent} from './internal';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoggedInGuard} from "../guards/logged-in.guard";

export const InternalRoutes: Routes = [
	{
		path: '',
		component: InternalComponent,
        canActivate: [LoggedInGuard],
		children: [
            { path: '', component: DashboardComponent },
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'customers',  component: CustomersComponent },
		]
	}
];
