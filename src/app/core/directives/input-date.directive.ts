import {OnInit, ElementRef, Directive, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Config} from "../config";
var Pikaday = require('pikaday');
var moment = require('moment');

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

    private picker: any;
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

    ngOnDestroy() {
        this.picker.destroy();
    }

    writeValue(value: any): void {
        if(value == undefined) {
            value = new Date();
        }
        this.picker.setDate(value);
        this.onChange();
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
