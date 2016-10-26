import {Routes} from '@angular/router';
import {CustomersComponent} from './customers/customers.component';
import {InternalComponent} from './internal';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoggedInGuard} from "../guards/logged-in.guard";
import {ReportsComponent} from "./reports/reports.component";
import {IncomeComponent} from "./income/income.component";
import {ExpensesComponent} from "./expenses/expenses.component";
import {ExpenseEditComponent} from "./expenses/expense-edit.component";
import {BootstrapResolver} from "../core/resolvers/bootstrap.resolver";
import {SettingsComponent} from "./settings/settings.component";
import {AccountSettingsComponent} from "./settings/account-settings.component";
import {ProfileSettingsComponent} from "./settings/profile-settings.component";
import {IncomeEditComponent} from "./income/income-edit.component";

export const InternalRoutes: Routes = [
	{
		path: '',
		component: InternalComponent,
        canActivate: [LoggedInGuard],
        resolve: {
		  bootstrap: BootstrapResolver
        },
		children: [
            { path: '', component: DashboardComponent },
			{ path: 'dashboard', component: DashboardComponent },
            { path: 'customers',  component: CustomersComponent },
            { path: 'reports',  component: ReportsComponent },

            { path: 'income', component: IncomeComponent },
            { path: 'income/new', component: IncomeEditComponent },
            { path: 'income/:id', component: IncomeEditComponent },

            { path: 'expenses', component: ExpensesComponent },
            { path: 'expenses/new', component: ExpenseEditComponent },
            { path: 'expenses/:id', component: ExpenseEditComponent },

            {
                path: 'settings',
                component: SettingsComponent,
                children: [
                    { path: 'account', component: AccountSettingsComponent },
                    { path: 'profile', component: ProfileSettingsComponent }
                ]
            }
		]
	}
];
