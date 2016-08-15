import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from 'ng2-translate/ng2-translate';
import {HttpModule} from "@angular/http";

import {AppComponent} from './app.component';
import {routing} from "./app.routing";
import {ButtonComponent} from "./core/components/button.component";
import {InputComponent} from "./core/components/input";
import {LoginService} from "./services/login.service";
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
        InputComponent,
        IconComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule,
        TranslateModule.forRoot(),
        routing,
    ],
    providers: [
        LoginService,
        UserService,
        CustomerService,
        State,
        LoggedInGuard
    ],
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {

}
