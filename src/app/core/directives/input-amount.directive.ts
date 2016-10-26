import {OnInit, ElementRef, Directive, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Config} from "../config";
import {Formatter} from "../formatter";

export const AMOUNT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AmountDirective),
    multi: true
};

@Directive({
    selector: 'input[nvry-amount]',
    providers: [AMOUNT_VALUE_ACCESSOR],
    host: {'(change)': 'onChange()', '(blur)': 'onBlur()'},
})
export class AmountDirective implements OnInit, ControlValueAccessor {

    private rawValue: number;
    private onChangeCallback: (_: any) => void = () => {};
    private onTouchedCallback = () => {};

    constructor(private el: ElementRef, private formatter: Formatter) {
    }

    ngOnInit() {}

    writeValue(value: any): void {
        this.setValue(value);
    }

    setValue(value) {
        this.el.nativeElement.value = this.formatter.money(value);
        this.rawValue = value;
    }

    updateTheValue() {
        let rawValue = this.formatter.parseMoney(this.el.nativeElement.value);
        this.setValue(rawValue);
    }

    onChange() {
        this.updateTheValue();
        this.onChangeCallback(this.rawValue);
    }

    onBlur() {
        this.updateTheValue();
        this.onTouchedCallback();
    }

    registerOnChange(fn: (_: any) => {}): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouchedCallback = fn;
    }

}