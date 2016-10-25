import {Component, forwardRef, Injector, ElementRef} from '@angular/core';
import {Input} from "@angular/core";
import {FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl, ControlContainer} from "@angular/forms";


export const NVRY_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
};

@Component({
    selector: 'nvry-input,nvry-textarea',
    template: `
        <label *ngIf="label">{{ label }}</label>
		
		<textarea 
		*ngIf="selector == 'nvry-textarea'"
		[placeholder]="placeholder"
		[(ngModel)]="value"
		(blur)="onTouchedCallback()"
		(ngModelChange)="onChange()"
		></textarea>
		
		<input
		*ngIf="type == 'date' && selector == 'nvry-input'"
		nvry-datepicker
		type="text"
		[placeholder]="placeholder"
		[(ngModel)]="value"
		(blur)="onTouchedCallback()"
		(ngModelChange)="onChange()">
		
		<input
		*ngIf="type != 'date' && type != 'money' && selector == 'nvry-input'"
		[type]="type"
		[placeholder]="placeholder"
		[(ngModel)]="value"
		(blur)="onTouchedCallback()"
		(ngModelChange)="onChange()">
        
        <input
		nvry-amount
		*ngIf="type == 'money' && selector == 'nvry-input'"
		type="text"
		[placeholder]="placeholder"
		[(ngModel)]="value"
		(blur)="onTouchedCallback()"
		(ngModelChange)="onChange()">
		
		<nvry-control-messages *ngIf="formControl" [control]="formControl"></nvry-control-messages>
	`,
    providers: [NVRY_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class InputComponent implements ControlValueAccessor {

    @Input() type: string = 'text';
    @Input() placeholder: string = '';
    @Input() formControl: FormControl;
    @Input() label: string;

    private onTouchedCallback: () => void = () => {};
    private onChangeCallback: (_: any) => void = () => {};

    private value: any = '';
    private selector: string;

    constructor(el: ElementRef) {
        this.selector = el.nativeElement.localName;
    }

    writeValue(value: any) {
        this.value = value;
    }

    onChange() {
        this.onChangeCallback(this.value);
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

}
