import {Component, OnInit, EventEmitter, ElementRef} from '@angular/core';
import {Input, Output} from "@angular/core/src/metadata/directives";
import * as $ from 'jquery';
require('select2');

@Component({
    selector: 'nvry-select',
    template: `
        <label *ngIf="label">{{ label }}</label>
        <select (change)="selectedChange.emit($event.target.value)">
           <option *ngFor="let option of options" value="{{ option.value }}">{{ option.name || option.value }}</option>
        </select>`
})
export class SelectComponent implements OnInit {

    @Input() options: any;
    @Input() selected: any;
    @Input() label: string;
    @Input() enableSearchField: boolean = true;

    @Output() selectedChange = new EventEmitter();

    constructor(private el: ElementRef) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        let select = this.el.nativeElement.querySelector('select');

        let minimumResults = this.enableSearchField ? 1 : -1;
        $(select).select2({
            minimumResultsForSearch: minimumResults
        });
    }

}
