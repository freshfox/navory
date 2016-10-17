import {Component} from '@angular/core';
import {Input} from "@angular/core";
import {FormControl} from "@angular/forms";

@Component({
    selector: 'nvry-input',
    template: `
        <label *ngIf="label">{{ label }}</label>
		<input
		[type]="type"
		[placeholder]="placeholder"
		[formControl]="control">
		<nvry-control-messages [control]="control"></nvry-control-messages>
	`
})
export class InputComponent {
    @Input() type: string = 'text';
    @Input() placeholder: string = '';
    @Input() control: FormControl;
    @Input() label: string;

    constructor() {
    }

}
