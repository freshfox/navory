import {OnInit, ElementRef, Directive} from '@angular/core';
import Pikaday from 'pikaday';

@Directive({
    selector: 'nvry-input[nvry-datepicker]',
    template: ``
})
export class DatePickerDirective implements OnInit {
    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        var picker = new Pikaday({
            field: this.el.nativeElement.querySelector('input'),
            format: 'DD.MM.YYYY',
            onSelect: function() {

            }
        });
    }

}
