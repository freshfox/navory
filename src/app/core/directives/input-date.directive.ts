import {OnInit, ElementRef, Directive, forwardRef} from '@angular/core';
import Pikaday from 'pikaday';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
var moment = require('moment');
import {Config} from "../config";

export const DATEPICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerDirective),
    multi: true
};

@Directive({
    selector: 'input[nvry-datepicker]',
    providers: [DATEPICKER_VALUE_ACCESSOR],
    host: {'(change)': 'onChange()', '(blur)': 'onTouched()'},
})
export class DatePickerDirective implements OnInit, ControlValueAccessor {

    private picker: Pikaday;
    private onChangeCallback: (_: any) => void = () => {};
    private format: string = 'DD.MM.YYYY';

    onTouched = () => {};

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.picker = new Pikaday({
            field: this.el.nativeElement,
            format: this.format,
            i18n: {
                months        : moment.localeData()._months,
                weekdays      : moment.localeData()._weekdays,
                weekdaysShort : moment.localeData()._weekdaysShort
            }
        });
    }

    writeValue(value: any): void {
        if(!value) {
            value = new Date();
        }
        this.picker.setDate(value);
    }

    onChange() {
        var val = this.el.nativeElement.value;
        let momentInstance = moment(val, this.format);

        if(momentInstance.isValid()) {
            val = momentInstance.format(Config.apiDateFormat);
        }

        this.onChangeCallback(val);
    }

    registerOnChange(fn: (_: any) => {}): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

}
