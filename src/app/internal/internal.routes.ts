import {Routes} from '@angular/router';
import {CustomersComponent} from './customers/customers.component';
import {InternalComponent} from './internal';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoggedInGuard} from '../guards/logged-in.guard';
import {IncomeListComponent} from './income/other-income/income-list.component';
import {ExpensesComponent} from './expenses/expenses.component';
import {ExpenseEditComponent} from './expenses/expense-edit.component';
import {BootstrapResolver} from '../core/resolvers/bootstrap.resolver';
import {SettingsComponent} from './settings/settings.component';
import {AccountSettingsComponent} from './settings/account-settings.component';
import {ProfileSettingsComponent} from './settings/profile-settings.component';
import {IncomeEditComponent} from './income/other-income/income-edit.component';
import {IncomeComponent} from './income/income.component';
import {InvoicesComponent} from './income/invoices/invoices.component';
import {InvoiceEditComponent} from './income/invoices/invoice-edit.component';
import {PaymentsComponent} from './payments/payments.component';
import {ReportsComponent} from 'app/internal/reports/reports.component';
import {VatReportComponent} from './reports/vat-report.component';
import {ProfitLossReportComponent} from './reports/profit-loss-report.component';
import {QuotesComponent} from './quotes/quotes.component';
import {QuoteEditComponent} from './quotes/quote-edit.component';
import {RecurringInvoicesComponent} from './income/recurring-invoices/recurring-invoices.component';
import {RecurringInvoiceEditComponent} from './income/recurring-invoices/recurring-invoice-edit.component';
import {EmailSettingsComponent} from './settings/email-settings.component';

export const InternalRoutes: Routes = [
	{
		path: '',
		component: InternalComponent,
		canActivate: [LoggedInGuard],
		resolve: {
			bootstrap: BootstrapResolver
		},
		children: [
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: 'dashboard', component: DashboardComponent},
			{path: 'customers', component: CustomersComponent},
			{path: 'payments', component: PaymentsComponent},
			{
				path: 'reports',
				component: ReportsComponent,
				children: [
					{path: '', redirectTo: 'vat', pathMatch: 'full'},
					{path: 'vat', component: VatReportComponent},
					{path: 'profit-loss', component: ProfitLossReportComponent}
				]
			},

			{
				path: 'income',
				component: IncomeComponent,
				children: [
					{path: '', pathMatch: 'full', redirectTo: 'invoices'},
					{path: 'invoices', component: InvoicesComponent},
					{path: 'other', component: IncomeListComponent},
					{path: 'recurring-invoices', component: RecurringInvoicesComponent},
				]
			},
			{path: 'income/invoices/new', component: InvoiceEditComponent},
			{path: 'income/invoices/:id', component: InvoiceEditComponent},
			{path: 'income/recurring-invoices/new', component: RecurringInvoiceEditComponent},
			{path: 'income/recurring-invoices/:id', component: RecurringInvoiceEditComponent},
			{path: 'income/other/new', component: IncomeEditComponent},
			{path: 'income/other/:id', component: IncomeEditComponent},


			{path: 'quotes', component: QuotesComponent},
			{path: 'quotes/new', component: QuoteEditComponent},
			{path: 'quotes/:id', component: QuoteEditComponent},

			{path: 'expenses', component: ExpensesComponent},
			{path: 'expenses/new', component: ExpenseEditComponent},
			{path: 'expenses/:id', component: ExpenseEditComponent},

			{
				path: 'settings',
				component: SettingsComponent,
				children: [
					{path: '', pathMatch: 'full', redirectTo: 'account'},
					{path: 'account', component: AccountSettingsComponent},
					{path: 'profile', component: ProfileSettingsComponent},
					{path: 'emails', component: EmailSettingsComponent }
				]
			}
		]
	}
];
