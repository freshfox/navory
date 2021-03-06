import {BrowserModule} from '@angular/platform-browser';
import {DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
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
import {DocumentPreviewComponent} from './core/components/document-preview.component';
import {FiveZeroThreeComponent} from './core/components/503.component';
import {StepsComponent} from './core/components/steps.component';
import {PaymentService} from './services/payment.service';
import {UnitService} from './services/unit.service';
import {InvoiceBookPaymentComponent} from './internal/payments/invoice-book-payment.component';
import {PaymentsTableComponent} from './internal/payments/payments-table.component';
import {BookedPaymentComponent} from './core/components/booked-payment.component';
import {IncomeBookPaymentComponent} from './internal/payments/income-book-payment.component';
import {BookPaymentComponent} from './internal/payments/book-payment.component';
import {TotalIndicatorComponent} from './core/components/total-indicator.component';
import {ExpenseBookPaymentComponent} from './internal/payments/expense-book-payment.component';
import {LogoUploadComponent} from './internal/settings/logo-upload.component';
import {LogoComponent} from './core/components/logo.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PublicGuard} from './guards/public.guard';
import {UpgradePlanComponent} from './core/components/upgrade-plan.component';
import {VatReportComponent} from './internal/reports/vat-report.component';
import {ProfitLossReportComponent} from './internal/reports/profit-loss-report.component';
import {FFCoreModule, FFMaterialModule} from './lib/ffc-angular/ff-core.module';
import {ValidationMessageProviderImpl} from './core/validation-message-provider';
import {QuotesComponent} from './internal/quotes/quotes.component';
import {QuoteService} from './services/quote.service';
import {InvoiceLinesEditComponent} from './core/components/invoice-lines-edit.component';
import {InvoiceEditCustomerComponent} from './core/components/invoice-edit-customer.component';
import {QuoteEditComponent} from './internal/quotes/quote-edit.component';
import {ValidationMessageProvider} from './lib/ffc-angular/validation-message-provider';
import {BadgeComponent} from './core/components/badge.component';
import {AnnualAccountsComponent} from './internal/settings/annual-accounts.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {translatePackagedLoaderFactory} from './core/translate-loader';
import {LocalStorageService} from './services/local-storage.service';
import {RecurringInvoicesComponent} from './internal/income/recurring-invoices/recurring-invoices.component';
import {RecurringInvoiceEditComponent} from './internal/income/recurring-invoices/recurring-invoice-edit.component';
import {CustomerSelectionComponent} from './core/components/customer-selection.component';
import {EmailSettingsComponent} from './internal/settings/email-settings.component';
import {EmailSettingsEditComponent} from './internal/settings/email-settings-edit.component';
import {
	FF_API_CONFIG,
	FFApiModule, FFAvatarModule,
	FFBadgeModule,
	FFButtonModule,
	FFDialogModule,
	FFSnackbarModule, FFTableModule
} from '@freshfox/ng-core';
import {UnauthorizedInterceptor} from './core/unauthorized-interceptor';
import {BankAccountCreateComponent} from './internal/payments/bank-account-create.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import de from '@angular/common/locales/de';
import {BookPaymentListComponent} from './internal/payments/book-payment-list.component';
import {MatButtonModule} from '@angular/material/button';
import {PaymentsExpensesTableComponent} from './internal/payments/payments-expenses-table.component';
import {PaymentComponent} from './internal/payments/payment.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {DocumentPreviewOverlayComponent} from './core/components/document-preview-overlay.component';
import {PaymentsIncomeTableComponent} from './internal/payments/payments-income-table.component';
import {PaymentImportComponent} from './internal/payments/payment-import.component';

registerLocaleData(de, 'de');

export function validationMessageProviderFactory() {
	return new ValidationMessageProviderImpl();
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
		DocumentPreviewOverlayComponent,
		DatePipe,
		FiveZeroThreeComponent,
		StepsComponent,
		BookPaymentComponent,
		InvoiceBookPaymentComponent,
		IncomeBookPaymentComponent,
		PaymentsTableComponent,
		BookedPaymentComponent,
		TotalIndicatorComponent,
		ExpenseBookPaymentComponent,
		LogoUploadComponent,
		LogoComponent,
		UpgradePlanComponent,
		ReportsComponent,
		ProfitLossReportComponent,
		QuotesComponent,
		InvoiceLinesEditComponent,
		InvoiceEditCustomerComponent,
		QuoteEditComponent,
		BadgeComponent,
		AnnualAccountsComponent,

		RecurringInvoicesComponent,
		RecurringInvoiceEditComponent,

		CustomerSelectionComponent,
		EmailSettingsComponent,
		EmailSettingsEditComponent,

		// Payments
		BankAccountCreateComponent,
		BookPaymentListComponent,
		PaymentsExpensesTableComponent,
		PaymentsIncomeTableComponent,
		PaymentComponent,
		PaymentImportComponent,
	],
	imports: [
		BrowserModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: translatePackagedLoaderFactory,
			}
		}),
		AppRoutingModule,
		FFMaterialModule,
		FFApiModule,
		FFDialogModule,
		FFButtonModule,
		FFBadgeModule,
		FFAvatarModule,
		FFTableModule,
		MatProgressSpinnerModule,
		MatTableModule,
		MatPaginatorModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatSelectModule,
		MatSortModule,
		MatCheckboxModule,
		MatAutocompleteModule,
		MatMenuModule,
		FFCoreModule.forRoot({
			validationMessageProvider: {
				provide: ValidationMessageProvider,
				useFactory: validationMessageProviderFactory
			}
		}),
		ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
		FFSnackbarModule,
		MatDialogModule,
	],
	providers: [
		{provide: LOCALE_ID, useValue: 'de-AT'},
		{provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR'},
		{
			provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
			useValue: {duration: 4000, horizontalPosition: 'left'} as MatSnackBarConfig
		},
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{
			provide: FF_API_CONFIG,
			useValue: {
				baseUrl: environment.apiUrl,
			}
		},
		{provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true},


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
		TaxRateService,
		InvoiceService,
		AccountService,
		PaymentService,
		UnitService,
		QuoteService,
		LocalStorageService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
