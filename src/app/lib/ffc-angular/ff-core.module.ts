import {ModuleWithProviders, NgModule, Provider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IconComponent} from './components/icon.component';
import {SpinnerComponent} from './components/spinner.component';
import {ControlMessagesComponent} from './components/control-messages.component';
import {InputComponent} from './components/input.component';
import {SelectComponent} from './components/select.component';
import {DatePickerDirective} from './directives/input-date.directive';
import {FormsModule} from '@angular/forms';
import {DecimalDirective} from './directives/input-decimal.directive';
import {NumberPipe} from './pipes/number.pipe';
import {SafePipe} from './pipes/safe.pipe';
import {Formatter} from './formatter';
import {AlertBarComponent} from './components/alert-bar.component';
import {DropdownComponent} from './components/dropdown.component';
import {FakeValidationMessageProvider, ValidationMessageProvider} from './validation-message-provider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

export * from './components/control-messages.component';
export * from './components/icon.component';
export * from './components/icon.component';
export * from './components/input.component';
export * from './components/material.module';
export * from './components/select.component';
export * from './components/spinner.component';

export * from './directives/input-date.directive';

export {NumberPipe} from './pipes/number.pipe';

export interface FFCoreModuleConfig {
	validationMessageProvider?: Provider;
}


@NgModule({
	imports: [BrowserModule, MatProgressSpinnerModule, FormsModule],
	declarations: [
		IconComponent,
		SpinnerComponent,
		ControlMessagesComponent,
		InputComponent,
		SelectComponent,
		DatePickerDirective,
		DecimalDirective,
		NumberPipe,
		SafePipe,
		AlertBarComponent,
		DropdownComponent,
	],
	exports: [
		IconComponent,
		SpinnerComponent,
		ControlMessagesComponent,
		InputComponent,
		SelectComponent,
		NumberPipe,
		SafePipe,
		AlertBarComponent,
		DropdownComponent,
	],
	providers: [
		NumberPipe,
		SafePipe,
		Formatter
	]
})
export class FFCoreModule {

	static forRoot(config: FFCoreModuleConfig = {}): ModuleWithProviders<FFCoreModule> {
		return {
			ngModule: FFCoreModule,
			providers: [
				config.validationMessageProvider || {
					provide: ValidationMessageProvider,
					useClass: FakeValidationMessageProvider
				},
			]
		};
	}
}
