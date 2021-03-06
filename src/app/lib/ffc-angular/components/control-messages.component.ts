import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ValidationMessageProvider} from '../validation-message-provider';

@Component({
	selector: 'ff-control-messages',
	template: `
		<div class="control-message" *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class ControlMessagesComponent {
	@Input() control: FormControl;



	constructor(private validationMessageProvider: ValidationMessageProvider) {

	}

	get errorMessage() {
		if (this.control) {
			for (let propertyName in this.control.errors) {
				if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
					if (this.validationMessageProvider) {
						return this.validationMessageProvider.getValidationMessage(propertyName, this.control.errors[propertyName]);
					}
				}
			}
		}

		return null;
	}
}
