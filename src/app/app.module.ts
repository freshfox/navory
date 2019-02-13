import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HttpModule, Http} from '@angular/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';
import {State} from './core/state';
import {CustomerService} from './services/customer.service';
import {LoggedInGuard} from './guards/logged-in.guard';
import {DashboardComponent} from './internal/dashboard/dashboard.component';
import {LoginComponent} from './public/login.component';
import {PublicComponent} from './public/public.component';
import {SignupComponent} from './public/signup.component';
import {CustomersComponent} from './internal/customers/customers.component';
import {InternalComponent} from './internal/internal';
import {AlertBarComponent} from './core/components/alert-bar.component';
import {ErrorHandler} from './core/error-handler';
import {ForgotPasswordComponent} from './public/forgot-password.component';
import {LoginLayoutComponent} from './public/login-layout.component';
import {ResetPasswordComponent} from './public/reset-password.component';
import {Config} from './core/config';
import {ReportsComponent} from './internal/reports/reports.component';
import {ReportService} from './services/report.service';
import {IncomeService} from './services/income.service';
import {IncomeListComponent} from './internal/income/other-income/income-list.component';
import {DatePipe} from './core/pipes/date.pipe';
import {ExpensesComponent} from './internal/expenses/expenses.component';
import {ExpenseService} from './services/expense.service';
import {MonthSelectionComponent} from './core/components/month-selection.component';
import {YearSelectionComponent} from './core/components/year-selection.component';
import {ExpenseEditComponent} from './internal/expenses/expense-edit.component';
import {BootstrapResolver} from './core/resolvers/bootstrap.resolver';
import {BootstrapService} from './services/bootstrap.service';
import {DocumentUploadComponent} from './core/components/document-upload/document-upload.component';
import {FileService} from './services/file.service';
import {PageNavigationComponent} from './core/components/document-upload/page-navigation.component';
import {SettingsComponent} from './internal/settings/settings.component';
import {AccountSettingsComponent} from './internal/settings/account-settings.component';
import {ProfileSettingsComponent} from './internal/settings/profile-settings.component';
import {ExpenseCategorySelectionComponent} from './internal/expenses/expense-category-selection.component';
import {Formatter123} from './core/formatter';
import {CustomerEditComponent} from './internal/customers/customer-edit.component';
import {TaxRateService} from './services/tax-rate.service';
import {IncomeEditComponent} from './internal/income/other-income/income-edit.component';
import {IncomeComponent} from './internal/income/income.component';
import {InvoicesComponent} from './internal/income/invoices/invoices.component';
import {InvoiceService} from './services/invoice.service';
import {InvoiceEditComponent} from './internal/income/invoices/invoice-edit.component';
import {InvoiceLineComponent} from './internal/income/invoices/invoice-line.component';
import {PaymentsComponent} from './internal/payments/payments.component';
import {ExportComponent} from './internal/settings/export.component';
import {AccountService} from './services/account.service';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {DocumentPreviewComponent} from './core/components/document-preview.component';
import {FiveZeroThreeComponent} from './core/components/503.component';
import {SubscriptionComponent} from './internal/settings/subscription.component';
import {StepsComponent} from './core/components/steps.component';
import {PaymentService} from './services/payment.service';
import {UnitService} from './services/unit.service';
import {InvoiceBookPaymentComponent} from './internal/payments/invoice-book-payment.component';
import {PaymentsBankAccountComponent} from './internal/payments/payments-bank-account.component';
import {BookedPaymentComponent} from './core/components/booked-payment.component';
import {IncomeBookPaymentComponent} from './internal/payments/income-book-payment.component';
import {BookPaymentComponent} from './internal/payments/book-payment.component';
import {TotalIndicatorComponent} from './core/components/total-indicator.component';
import {ExpenseBookPaymentComponent} from './internal/payments/expense-book-payment.component';
import {LogoUploadComponent} from './internal/settings/logo-upload.component';
import {AnalyticsService} from './services/analytics.service';
import {LogoComponent} from './core/components/logo.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PublicGuard} from './guards/public.guard';
import {SubscriptionFormComponent} from './internal/settings/subscription-form.component';
import {SubscriptionService} from './services/subscription.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {CancelSubscriptionComponent} from './internal/settings/cancel-subscription.component';
import {UpgradePlanComponent} from './core/components/upgrade-plan.component';
import {VatReportComponent} from './internal/reports/vat-report.component';
import {ProfitLossReportComponent} from './internal/reports/profit-loss-report.component';
import {FFCoreModule, FFMaterialModule} from './lib/ffc-angular/ff-core.module';
import {ValidationMessageProviderImpl} from './core/validation-message-provider';
import {QuotesComponent} from './internal/quotes/quotes.component';
import {QuoteService} from './services/quote.service';
import {BaseInvoiceService} from './services/base-invoice.service';
import {InvoiceLinesEditComponent} from './core/components/invoice-lines-edit.component';
import {InvoiceEditCustomerComponent} from './core/components/invoice-edit-customer.component';
import {QuoteEditComponent} from './internal/quotes/quote-edit.component';
import {ValidationMessageProvider} from './lib/ffc-angular/validation-message-provider';
import {BadgeComponent} from './core/components/badge.component';
import {AnnualAccountsComponent} from './internal/settings/annual-accounts.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatProgressSpinnerModule, MatTooltipModule} from '@angular/material';

declare let window: any;

export function validationMessageProviderFactory() {
	return new ValidationMessageProviderImpl();
}

export function translateStaticLoaderFactory(httpClient: HttpClient) {
	return new TranslateHttpLoader(httpClient, '/assets/i18n/', `${window.I18N_HASH || ''}.json`);
}

@NgModule({
	declarations: [
		AppComponent,
		InternalComponent,
		DashboardComponent,
		LoginComponent,
		PublicComponent,
		SignupComponent,
		CustomersComponent,
		AlertBarComponent,
		ForgotPasswordComponent,
		LoginLayoutComponent,
		ResetPasswordComponent,
		VatReportComponent,
		IncomeListComponent,
		ExpensesComponent,
		MonthSelectionComponent,
		YearSelectionComponent,
		ExpenseEditComponent,
		DocumentUploadComponent,
		PageNavigationComponent,
		SettingsComponent,
		AccountSettingsComponent,
		ProfileSettingsComponent,
		ExpenseCategorySelectionComponent,
		CustomerEditComponent,
		IncomeEditComponent,
		IncomeComponent,
		InvoicesComponent,
		InvoiceEditComponent,
		InvoiceLineComponent,
		PaymentsComponent,
		ExportComponent,
		DocumentPreviewComponent,
		DatePipe,
		FiveZeroThreeComponent,
		SubscriptionComponent,
		StepsComponent,
		BookPaymentComponent,
		InvoiceBookPaymentComponent,
		IncomeBookPaymentComponent,
		PaymentsBankAccountComponent,
		BookedPaymentComponent,
		TotalIndicatorComponent,
		ExpenseBookPaymentComponent,
		LogoUploadComponent,
		LogoComponent,
		SubscriptionFormComponent,
		CancelSubscriptionComponent,
		UpgradePlanComponent,
		ReportsComponent,
		ProfitLossReportComponent,
		QuotesComponent,
		InvoiceLinesEditComponent,
		InvoiceEditCustomerComponent,
		QuoteEditComponent,
		BadgeComponent,
		AnnualAccountsComponent
	],
	entryComponents: [
		CustomerEditComponent,
		InvoiceBookPaymentComponent,
		IncomeBookPaymentComponent,
		ExpenseBookPaymentComponent,
		SubscriptionFormComponent,
		ExpenseCategorySelectionComponent,
		DocumentPreviewComponent,
		CancelSubscriptionComponent,
		UpgradePlanComponent
	],
	imports: [
		BrowserModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		HttpClientModule,
		BrowserAnimationsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: translateStaticLoaderFactory,
				deps: [HttpClient]
			}
		}),
		AppRoutingModule,
		FFMaterialModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		SimpleNotificationsModule.forRoot(),
		FFCoreModule.forRoot({
			validationMessageProvider: {
				provide: ValidationMessageProvider,
				useFactory: validationMessageProviderFactory
			}
		})
	],
	providers: [
		AuthService,
		UserService,
		CustomerService,
		IncomeService,
		ReportService,
		ExpenseService,
		State,
		LoggedInGuard,
		PublicGuard,
		ErrorHandler,
		Config,
		DatePipe,
		BootstrapResolver,
		BootstrapService,
		FileService,
		Formatter123,
		TaxRateService,
		InvoiceService,
		AccountService,
		PaymentService,
		UnitService,
		AnalyticsService,
		SubscriptionService,
		QuoteService,
		BaseInvoiceService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
