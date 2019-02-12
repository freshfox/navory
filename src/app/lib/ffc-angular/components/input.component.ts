import {AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';


export const FF_INPUT_CONTROL_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => InputComponent),
	multi: true
};

@Component({
	selector: 'ff-input,ff-textarea',
	template: `
		<label *ngIf="label">{{ label }}</label>

		<textarea
			*ngIf="selector == 'ff-textarea'"
			[placeholder]="placeholder"
			[attr.name]="name"
			[(ngModel)]="value"
			(blur)="onBlur($event)"
			(focus)="onFocus($event)"
			(ngModelChange)="onChange()"
			[tabindex]="tabindex ? tabindex : null"
			[attr.disabled]="disabledSet ? true : null"
			(input)="autoGrow($event.target)"
		></textarea>

		<input
			*ngIf="type == 'date' && selector == 'ff-input'"
			ff-datepicker
			type="text"
			[placeholder]="placeholder"
			[attr.name]="name"
			[(ngModel)]="value"
			(blur)="onBlur($event)"
			(focus)="onFocus($event)"
			[attr.disabled]="disabledSet ? true : null"
			(ngModelChange)="onChange()"
			[tabindex]="tabindex">

		<input
			*ngIf="type != 'date' && type != 'money' && selector == 'ff-input'"
			[type]="type"
			[placeholder]="placeholder"
			[attr.name]="name"
			[(ngModel)]="value"
			(blur)="onBlur($event)"
			(focus)="onFocus($event)"
			[attr.disabled]="disabledSet ? true : null"
			(ngModelChange)="onChange()"
			[tabindex]="tabindex ? tabindex : null">

		<input
			ff-decimal
			*ngIf="type == 'money' && selector == 'ff-input'"
			[alwaysShowDecimals]="alwaysShowDecimals"
			[numberOfDecimals]="numberOfDecimals"
			type="text"
			[placeholder]="placeholder"
			[attr.name]="name"
			[(ngModel)]="value"
			(blur)="onBlur($event)"
			(focus)="onFocus($event)"
			[attr.disabled]="disabledSet ? true : null"
			(ngModelChange)="onChange()"
			[tabindex]="tabindex ? tabindex : null">

		<ff-control-messages *ngIf="formControl" [control]="formControl"></ff-control-messages>
	`,
	providers: [FF_INPUT_CONTROL_VALUE_ACCESSOR],
	host: {
		'[class.ff-focused]': 'isFocused',
	}
})
export class InputComponent implements ControlValueAccessor, OnInit, AfterViewInit {

	@Input() type = 'text';
	@Input() placeholder = '';
	@Input() formControl: FormControl;
	@Input() label: string;
	@Input() alwaysShowDecimals: boolean;
	@Input() numberOfDecimals: number;
	@Input() tabindex: number;

	@Input()
	public set disabled(value: any) {
		if (value !== false) {
			this.disabledSet = true;
		}
	}

	@Output() focus: EventEmitter<any> = new EventEmitter<any>();
	@Output() blur: EventEmitter<any> = new EventEmitter<any>();


	selector: string;
	name: string;
	disabledSet = false;

	value: any = '';
	private isFocused = false;
	private onTouchedCallback: () => void = () => {};
	private onChangeCallback: (_: any) => void = () => {};

	constructor(private el: ElementRef) {
		this.selector = el.nativeElement.localName;
	}

	ngOnInit(): void {
		this.name = this.getFieldName();
	}

	ngAfterViewInit() {
		if (this.selector === 'ff-textarea') {
			const textarea = this.el.nativeElement.querySelector('textarea');
			if (textarea) {
				setTimeout(() => {
					this.autoGrow(textarea);
				}, 1);
			}
		}
	}

	getFieldName(): string {
		const parent = this.formControl ? this.formControl['_parent'] : null;
		if (!parent) {
			return;
		}
		const siblings = Object.keys(parent.controls);
		for (let i = 0; i < siblings.length; i++) {
			const key = siblings[i];
			if (parent.controls[key] === this.formControl) {
				return key;
			}
		}
	}

	writeValue(value: any) {
		this.value = value;
	}

	onChange() {
		this.onChangeCallback(this.value);
	}

	onFocus(event) {
		this.focus.next(event);
		this.isFocused = true;
	}

	onBlur(event) {
		this.blur.next(event);
		this.isFocused = false;
		this.onTouchedCallback();
	}

	registerOnChange(fn: any) {
		this.onChangeCallback = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouchedCallback = fn;
	}

	autoGrow(element) {
		element.style.height = '5px';
		element.style.height = (element.scrollHeight) + 'px';
	}

}
