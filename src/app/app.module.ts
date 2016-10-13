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
import {Angular2DataTableModule} from "angular2-data-table";
import {ReportsComponent} from "./internal/reports/reports.component";
import {SelectComponent} from "./core/components/select.component";
import {NumberPipe} from "./core/pipes/number.pipe";
import {ReportService} from "./services/report.service";

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
        NumberPipe
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        Angular2DataTableModule,
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
        ReportService,
        State,
        LoggedInGuard,
        ErrorHandler,
        Config
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
