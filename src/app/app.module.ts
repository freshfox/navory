import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {HttpModule, Http} from "@angular/http";

import {AppComponent} from './app.component';
import {routing} from "./app.routing";
import {ButtonComponent} from "./core/components/button.component";
import {AuthService} from "./services/auth.service";
import {UserService} from "./services/user.service";
import {State} from "./core/state";
import {IconComponent} from "./core/components/icon";
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
import {IncomeComponent} from "./internal/income/income.component";
import {DatePipe} from "./core/pipes/date.pipe";
import {ExpensesComponent} from "./internal/expenses/expenses.component";
import {ExpenseService} from "./services/expense.service";
import {MonthSelectionComponent} from "./internal/expenses/month-selection.component";
import {YearSelectionComponent} from "./core/components/year-selection.component";
import {ExpenseEditComponent} from "./internal/expenses/expense-edit.component";
import {BootstrapResolver} from "./core/resolvers/bootstrap.resolver";
import {BootstrapService} from "./services/bootstrap.service";
import {DocumentUploadComponent} from "./core/components/document-upload/document-upload.component";
import {FileService} from "./services/file.service";
import {PageNavigationComponent} from "./core/components/document-upload/page-navigation.component";
import {MdProgressCircle} from "@angular2-material/progress-circle";
import {SettingsComponent} from "./internal/settings/settings.component";
import {AccountSettingsComponent} from "./internal/settings/account-settings.component";
import {ProfileSettingsComponent} from "./internal/settings/profile-settings.component";
import {ModalComponent} from "./core/components/modal.component";
import {ExpenseCategorySelectionComponent} from "./internal/expenses/expense-category-selection.component";
import {DatePickerDirective} from "./core/directives/input-date.directive";
import {Formatter} from "./core/formatter";

@NgModule({
    declarations: [
        AppComponent,
        InternalComponent,
        DashboardComponent,
        LoginComponent,
        PublicComponent,
        SignupComponent,
        CustomersComponent,
        ButtonComponent,
        IconComponent,
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
        IncomeComponent,
        ExpensesComponent,
        MonthSelectionComponent,
        YearSelectionComponent,
        ExpenseEditComponent,
        DocumentUploadComponent,
        PageNavigationComponent,
        MdProgressCircle,
        SettingsComponent,
        AccountSettingsComponent,
        ProfileSettingsComponent,
        ModalComponent,
        ExpenseCategorySelectionComponent,
        DatePickerDirective
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
            deps: [Http]
        }),
        routing,
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
        ErrorHandler,
        Config,
        NumberPipe,
        DatePipe,
        BootstrapResolver,
        BootstrapService,
        FileService,
        Formatter
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
