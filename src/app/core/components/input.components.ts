import {Component, forwardRef, Injector, ElementRef, EventEmitter, Output} from '@angular/core';
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
		(blur)="onBlur($event)"
		(focus)="onFocus($event)"
		(ngModelChange)="onChange()"
		[attr.disabled]="disabledSet ? true : null"
		(input)="autoGrow($event.target)"
		></textarea>
		
		<input
		*ngIf="type == 'date' && selector == 'nvry-input'"
		nvry-datepicker
		type="text"
		[placeholder]="placeholder"
		[(ngModel)]="value"
		(blur)="onBlur($event)"
		(focus)="onFocus($event)"
		[attr.disabled]="disabledSet ? true : null"
		(ngModelChange)="onChange()">
		
		<input
		*ngIf="type != 'date' && type != 'money' && selector == 'nvry-input'"
		[type]="type"
		[placeholder]="placeholder"
		[(ngModel)]="value"
		(blur)="onBlur($event)"
		(focus)="onFocus($event)"
		[attr.disabled]="disabledSet ? true : null"
		(ngModelChange)="onChange()">
        
        <input
		nvry-amount
		*ngIf="type == 'money' && selector == 'nvry-input'"
		[alwaysShowDecimals]="alwaysShowDecimals"
		type="text"
		[placeholder]="placeholder"
		[(ngModel)]="value"
		(blur)="onBlur($event)"
		(focus)="onFocus($event)"
		[attr.disabled]="disabledSet ? true : null"
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
    @Input() alwaysShowDecimals: boolean;

    @Input() public set disabled(value: any) {
        this.disabledSet = true;
    }

    @Output() focus: EventEmitter<any> = new EventEmitter<any>();
    @Output() blur: EventEmitter<any> = new EventEmitter<any>();

    private onTouchedCallback: () => void = () => {};
    private onChangeCallback: (_: any) => void = () => {};

    private value: any = '';
    private selector: string;
    private disabledSet: boolean = false;

    constructor(el: ElementRef) {
        this.selector = el.nativeElement.localName;
    }

    writeValue(value: any) {
        this.value = value;
    }

    onChange() {
        this.onChangeCallback(this.value);
    }

    onFocus(event) {
        this.focus.next(event);
    }

    onBlur(event) {
        this.blur.next(event);
        this.onTouchedCallback();
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    autoGrow(element) {
        element.style.height = "5px";
        element.style.height = (element.scrollHeight)+"px";
    }

}
