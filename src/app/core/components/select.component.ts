import {Component, OnInit, EventEmitter, ElementRef} from '@angular/core';
import {Input, Output} from "@angular/core/src/metadata/directives";
import * as $ from 'jquery';
require('select2');

@Component({
    selector: 'nvry-select',
    template: `
        <label *ngIf="label">{{ label }}</label>
        <select (change)="onChange(s.value)" #s>
           <option 
           *ngFor="let option of options" 
           [attr.value]="getValue(option)" [attr.selected]="selectedValue == getValue(option) ? true : null">{{ getName(option) }}</option>
        </select>`
})
export class SelectComponent implements OnInit {

    @Input() options: any;
    @Input() valueKey: string = 'id';
    @Input() nameKey: string = 'name';

    @Input() selectedValue: any;
    @Output() selectedValueChange = new EventEmitter<any>();

    @Input() label: string;

    @Input() enableSearchField: boolean = true;

    constructor(private el: ElementRef) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        let select = this.el.nativeElement.querySelector('select');

        /*let minimumResults = this.enableSearchField ? 1 : -1;
        $(select).select2({
            minimumResultsForSearch: minimumResults
        });*/
    }

    private getValue(option) {
        return option[this.valueKey];
    }

    private getName(option) {
        return option[this.nameKey] || this.getValue(option);
    }

    private onChange(value) {
        this.selectedValue = value;
        this.selectedValueChange.emit(this.selectedValue);
    }

}
