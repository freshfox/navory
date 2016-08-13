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

@NgModule({
    declarations: [
        AppComponent,
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
        CustomerService
        State
    ],
    entryComponents: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {

}
