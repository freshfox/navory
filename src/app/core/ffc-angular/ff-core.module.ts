import {Injectable, ModuleWithProviders, NgModule, Provider} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IconComponent} from "./components/icon.component";
import {ButtonComponent} from "./components/button.component";
import {SpinnerComponent} from "./components/spinner.component";
import {ConfirmComponent} from "./components/confirm.component";
import {ControlMessagesComponent} from "./components/control-messages.component";
import {InputComponent} from "./components/input.component";
import {SelectComponent} from "./components/select.component";
import {DatePickerDirective} from "./directives/input-date.directive";
import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {DecimalDirective} from "./directives/input-decimal.directive";
import {NumberPipe} from "./pipes/number.pipe";
import {SafePipe} from "./pipes/safe.pipe";
import {ModalPlaceholderComponent, ModalService} from "./services/modal.service";
import {Formatter} from "./formatter";

export * from './components/button.component';
export * from './components/confirm.component';
export * from './components/control-messages.component';
export * from './components/icon.component';
export * from './components/icon.component';
export * from './components/input.component';
export * from './components/material.module';
export * from './components/select.component';
export * from './components/spinner.component';

export * from './services/modal.service';
export * from './directives/input-date.directive';

export {NumberPipe} from './pipes/number.pipe';


@NgModule({
    imports: [BrowserModule, MaterialModule, FormsModule],
    declarations: [
        IconComponent,
        ButtonComponent,
        SpinnerComponent,
        ConfirmComponent,
        ControlMessagesComponent,
        InputComponent,
        SelectComponent,
		ModalPlaceholderComponent,
		DatePickerDirective,
		DecimalDirective,
		NumberPipe,
		SafePipe,
    ],
    exports: [
        IconComponent,
        ButtonComponent,
        SpinnerComponent,
        ConfirmComponent,
        ControlMessagesComponent,
        InputComponent,
        SelectComponent,
		ModalPlaceholderComponent,
		NumberPipe,
		SafePipe,
    ],
	entryComponents: [
		ConfirmComponent
	],
	providers: [
		ModalService,
		NumberPipe,
		SafePipe,
		Formatter
	]
})
export class FFCoreModule {

    static forRoot(config: FFCoreModuleConfig = {}): ModuleWithProviders {
        let module = {
            ngModule: FFCoreModule,
            providers: [
                config.validationMessageProvider || {provide: ValidationMessageProvider, useClass: FakeValidationMessageProvider},
            ]
        };
        return module;
    }
}


export interface FFCoreModuleConfig {
    validationMessageProvider?: Provider;
}

export abstract class ValidationMessageProvider {
    abstract getValidationMessage(validatorName: string, validatorValue?: any): string;
}

@Injectable()
export class FakeValidationMessageProvider extends ValidationMessageProvider {
    getValidationMessage(validatorName: string, validatorValue?: any): string {
        return '';
    }
}
