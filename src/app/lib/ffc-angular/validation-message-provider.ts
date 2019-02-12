import {Injectable} from '@angular/core';

export abstract class ValidationMessageProvider {
	abstract getValidationMessage(validatorName: string, validatorValue?: any): string;
}

@Injectable()
export class FakeValidationMessageProvider extends ValidationMessageProvider {
	getValidationMessage(validatorName: string, validatorValue?: any): string {
		return '';
	}
}
