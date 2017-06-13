import {OnInit, ElementRef, Directive, forwardRef} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import Pikaday from 'pikaday';
import moment from 'moment';

export const DATEPICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerDirective),
    multi: true
};

@Directive({
    selector: 'input[ff-datepicker]',
    providers: [DATEPICKER_VALUE_ACCESSOR],
    host: {'(change)': 'onChange()', '(blur)': 'onTouched()'},
})
export class DatePickerDirective implements OnInit, ControlValueAccessor {

    private picker: any;
    private onChangeCallback: (_: any) => void = () => {
    };
    private format: string = 'DD.MM.YYYY';

    onTouched = () => {
    };

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.picker = new Pikaday({
            field: this.el.nativeElement,
            format: this.format,
            i18n: {
                months: moment.localeData().months(),
                weekdays: moment.localeData().weekdays(),
                weekdaysShort: moment.localeData().weekdaysShort()
            }
        });
        document.removeEventListener('keydown', this.picker._onKeyChange);
    }

    ngOnDestroy() {
        this.picker.destroy();
    }

    writeValue(value: any): void {
        if (value == undefined) {
            value = new Date();
        }
        this.picker.setDate(value);
        this.onChange();
    }

    onChange() {
        let val = this.el.nativeElement.value;
        let momentInstance = moment(val, this.format);

        if (momentInstance.isValid()) {
            val = momentInstance.format('YYYY-MM-DD');
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
