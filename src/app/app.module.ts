import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {HttpModule, Http} from "@angular/http";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app.routing";
import {AuthService} from "./services/auth.service";
import {UserService} from "./services/user.service";
import {State} from "./core/state";
import {CustomerService} from "./services/customer.service";
import {LoggedInGuard} from "./guards/logged-in.guard";
import {DashboardComponent} from "./internal/dashboard/dashboard.component";
import {LoginComponent} from "./public/login.component";
import {PublicComponent} from "./public/public.component";
import {SignupComponent} from "./public/signup.component";
import {CustomersComponent} from "./internal/customers/customers.component";
import {InternalComponent} from "./internal/internal";
import {AlertBarComponent} from "./core/components/alert-bar.component";
import {ErrorHandler} from "./core/error-handler";
import {ForgotPasswordComponent} from "./public/forgot-password.component";
import {ControlMessagesComponent} from "./core/components/control-messages.component";
import {LoginLayoutComponent} from "./public/login-layout.component";
import {ResetPasswordComponent} from "./public/reset-password.component";
import {Config} from "./core/config";
import {InputComponent} from "./core/components/input.components";
import {ReportsComponent} from "./internal/reports/reports.component";
import {SelectComponent} from "./core/components/select.component";
import {NumberPipe} from "./core/pipes/number.pipe";
import {ReportService} from "./services/report.service";
import {TableComponent} from "./core/components/table/table.component";
import {TableHeaderCellComponent} from "./core/components/table/table-header-cell.component";
import {SpinnerComponent} from "./core/components/spinner.component";
import {IncomeService} from "./services/income.service";
import {IncomeListComponent} from "./internal/income/other-income/income-list.component";
import {DatePipe} from "./core/pipes/date.pipe";
import {ExpensesComponent} from "./internal/expenses/expenses.component";
import {ExpenseService} from "./services/expense.service";
import {MonthSelectionComponent} from "./core/components/month-selection.component";
import {YearSelectionComponent} from "./core/components/year-selection.component";
import {ExpenseEditComponent} from "./internal/expenses/expense-edit.component";
import {BootstrapResolver} from "./core/resolvers/bootstrap.resolver";
import {BootstrapService} from "./services/bootstrap.service";
import {DocumentUploadComponent} from "./core/components/document-upload/document-upload.component";
import {FileService} from "./services/file.service";
import {PageNavigationComponent} from "./core/components/document-upload/page-navigation.component";
import {SettingsComponent} from "./internal/settings/settings.component";
import {AccountSettingsComponent} from "./internal/settings/account-settings.component";
import {ProfileSettingsComponent} from "./internal/settings/profile-settings.component";
import {ExpenseCategorySelectionComponent} from "./internal/expenses/expense-category-selection.component";
import {DatePickerDirective} from "./core/directives/input-date.directive";
import {Formatter} from "./core/formatter";
import {CustomerEditComponent} from "./internal/customers/customer-edit.component";
import {AmountDirective} from "./core/directives/input-amount.directive";
import {TaxRateService} from "./services/tax-rate.service";
import {IncomeEditComponent} from "./internal/income/other-income/income-edit.component";
import {IncomeComponent} from "./internal/income/income.component";
import {InvoicesComponent} from "./internal/income/invoices/invoices.component";
import {InvoiceService} from "./services/invoice.service";
import {InvoiceEditComponent} from "./internal/income/invoices/invoice-edit.component";
import {InvoiceLineComponent} from "./internal/income/invoices/invoice-line.component";
import {PaymentsComponent} from "./internal/payments/payments.component";
import {DropdownComponent} from "./core/components/dropdown.component";
import {ExportComponent} from "./internal/settings/export.component";
import {AccountService} from "./services/account.service";
import {SimpleNotificationsModule} from "angular2-notifications";
import {SafePipe} from "./core/pipes/safe.pipe";
import {DocumentPreviewComponent} from "./core/components/document-preview.component";
import {FiveZeroThreeComponent} from "./core/components/503.component";
import {ModalModule} from "./core/modal.module";
import {ConfirmComponent} from "./core/components/confirm.component";
import {SubscriptionComponent} from "./internal/settings/subscription.component";
import {StepsComponent} from "./core/components/steps.component";
import {PaymentService} from "./services/payment.service";
import {UnitService} from "./services/unit.service";
import {MaterialModule} from "@angular/material";
import {InvoiceBookPaymentComponent} from "./internal/payments/invoice-book-payment.component";
import {PaymentsBankAccountComponent} from "./internal/payments/payments-bank-account.component";
import {BookedPaymentComponent} from "./core/components/booked-payment.component";
import {IncomeBookPaymentComponent} from "./internal/payments/income-book-payment.component";
import {BookPaymentComponent} from "./internal/payments/book-payment.component";
import {TotalIndicatorComponent} from "./core/components/total-indicator.component";
import {ExpenseBookPaymentComponent} from "./internal/payments/expense-book-payment.component";
import {LogoUploadComponent} from "./internal/settings/logo-upload.component";
import {Angulartics2Module, Angulartics2GoogleAnalytics} from "angulartics2";
import {AnalyticsService} from "./services/analytics.service";
import {LogoComponent} from "./core/components/logo.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {PublicGuard} from "./guards/public.guard";
import {SubscriptionFormComponent} from "./internal/settings/subscription-form.component";
import {SubscriptionService} from "./services/subscription.service";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {CoreModule} from "./core/core.module";
import {CancelSubscriptionComponent} from "./internal/settings/cancel-subscription.component";
import {UpgradePlanComponent} from "./core/components/upgrade-plan.component";

export function translateStaticLoaderFactory(http: Http) {
	return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
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
		ControlMessagesComponent,
		LoginLayoutComponent,
		ResetPasswordComponent,
		ReportsComponent,
		InputComponent,
		SelectComponent,
		NumberPipe,
		TableComponent,
		TableHeaderCellComponent,
		SpinnerComponent,
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
		DatePickerDirective,
		CustomerEditComponent,
		AmountDirective,
		IncomeEditComponent,
		IncomeComponent,
		InvoicesComponent,
		InvoiceEditComponent,
		InvoiceLineComponent,
		PaymentsComponent,
		DropdownComponent,
		ExportComponent,
		SafePipe,
		DocumentPreviewComponent,
		DatePipe,
		FiveZeroThreeComponent,
		ConfirmComponent,
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
		UpgradePlanComponent
	],
	entryComponents: [
		CustomerEditComponent,
		InvoiceBookPaymentComponent,
		IncomeBookPaymentComponent,
		ExpenseBookPaymentComponent,
		ConfirmComponent,
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
		BrowserAnimationsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: translateStaticLoaderFactory,
				deps: [Http]
			}
		}),
		AppRoutingModule,
		SimpleNotificationsModule.forRoot(),
		MaterialModule,
		ModalModule,
		Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
		CoreModule
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
		NumberPipe,
		DatePipe,
		BootstrapResolver,
		BootstrapService,
		FileService,
		Formatter,
		TaxRateService,
		InvoiceService,
		AccountService,
		PaymentService,
		UnitService,
		AnalyticsService,
		SubscriptionService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
