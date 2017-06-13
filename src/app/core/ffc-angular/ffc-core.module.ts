import {Injectable, ModuleWithProviders, NgModule, Provider} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IconComponent} from "./components/icon.component";
import {ButtonComponent} from "./components/button.component";
import {SpinnerComponent} from "./components/spinner.component";
import {FFMaterialModule} from "./components/material.module";
import {ConfirmComponent} from "./components/confirm.component";
import {ControlMessagesComponent} from "./components/control-messages.component";
import {InputComponent} from "./components/input.component";
import {SelectComponent} from "./components/select.component";
import {ModalPlaceholderComponent, ModalPlaceholderComponent} from "./components/modal.component";
import {DatePickerDirective} from "./directives/input-date.directive";

export * from './components/button.component';
export * from './components/confirm.component';
export * from './components/control-messages.component';
export * from './components/icon.component';
export * from './components/icon.component';
export * from './components/input.component';
export * from './components/material.module';
export * from './components/modal.component';
export * from './components/select.component';
export * from './components/spinner.component';

export * from './services/modal.service';
export * from './directives/input-date.directive';



@NgModule({
    imports: [BrowserModule, FFMaterialModule],
    declarations: [
        IconComponent,
        ButtonComponent,
        SpinnerComponent,
        ConfirmComponent,
        ControlMessagesComponent,
        InputComponent,
        SelectComponent,
		ModalPlaceholderComponent,
		DatePickerDirective
    ],
    exports: [
        IconComponent,
        ButtonComponent,
        SpinnerComponent,
        ConfirmComponent,
        ControlMessagesComponent,
        InputComponent,
        SelectComponent,
		ModalPlaceholderComponent
    ],
	entryComponents: [
		ConfirmComponent
	]
})
export class FFCoreModule {

    static forRoot(config: FFCoreModuleConfig = {}): ModuleWithProviders {
        return {
            ngModule: FFCoreModule,
            providers: [
                config.validationMessageProvider || {provide: ValidationMessageProvider, useClass: FakeValidationMessageProvider},
            ]
        };
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
