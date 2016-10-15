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
import {CoreModule} from "./core/core.module";
import {TableComponent} from "./core/components/table/table.component";
import {TableHeaderCellComponent} from "./core/components/table/table-header-cell.component";
import {SpinnerComponent} from "./core/components/spinner.component";
import {IncomeService} from "./services/income.service";
import {IncomeComponent} from "./internal/income/income.component";
import {DatePipe} from "./core/pipes/date.pipe";

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
        IncomeComponent
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
        State,
        LoggedInGuard,
        ErrorHandler,
        Config,
        NumberPipe,
        DatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
