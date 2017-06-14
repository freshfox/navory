import {Routes} from "@angular/router";
import {CustomersComponent} from "./customers/customers.component";
import {InternalComponent} from "./internal";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LoggedInGuard} from "../guards/logged-in.guard";
import {IncomeListComponent} from "./income/other-income/income-list.component";
import {ExpensesComponent} from "./expenses/expenses.component";
import {ExpenseEditComponent} from "./expenses/expense-edit.component";
import {BootstrapResolver} from "../core/resolvers/bootstrap.resolver";
import {SettingsComponent} from "./settings/settings.component";
import {AccountSettingsComponent} from "./settings/account-settings.component";
import {ProfileSettingsComponent} from "./settings/profile-settings.component";
import {IncomeEditComponent} from "./income/other-income/income-edit.component";
import {IncomeComponent} from "./income/income.component";
import {InvoicesComponent} from "./income/invoices/invoices.component";
import {InvoiceEditComponent} from "./income/invoices/invoice-edit.component";
import {PaymentsComponent} from "./payments/payments.component";
import {SubscriptionComponent} from "./settings/subscription.component";
import {ReportsComponent} from "app/internal/reports/reports.component";
import {VatReportComponent} from "./reports/vat-report.component";
import {ProfitLossReportComponent} from "./reports/profit-loss-report.component";
import {QuotesComponent} from "./quotes/quotes.component";

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
				path: '',
				component: IncomeComponent,
				children: [
					{path: 'invoices', component: InvoicesComponent},
					{path: 'income', component: IncomeListComponent},
				]
			},

			{path: 'quotes', component: QuotesComponent},
			//{path: 'quotes/new', component: QuoteEditComponent},
			//{path: 'quotes/:id', component: QuoteEditComponent},

			{path: 'invoices/new', component: InvoiceEditComponent},
			{path: 'invoices/:id', component: InvoiceEditComponent},

			{path: 'income/new', component: IncomeEditComponent},
			{path: 'income/:id', component: IncomeEditComponent},

			{path: 'expenses', component: ExpensesComponent},
			{path: 'expenses/new', component: ExpenseEditComponent},
			{path: 'expenses/:id', component: ExpenseEditComponent},

			{
				path: 'settings',
				component: SettingsComponent,
				children: [
					{path: 'account', component: AccountSettingsComponent},
					{path: 'profile', component: ProfileSettingsComponent},
					{path: 'subscription', component: SubscriptionComponent}
				]
			}
		]
	}
];
