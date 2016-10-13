import {Component, OnInit, EventEmitter} from '@angular/core';
import {Input, Output} from "@angular/core/src/metadata/directives";

@Component({
    selector: 'nvry-select',
    template: `
        <select (change)="selectedChange.emit($event.target.value)">
           <option *ngFor="let option of options">{{ option.name || option.value }}</option>
        </select>`
})
export class SelectComponent implements OnInit {

    @Input() options: any;
    @Input() selected: any;

    @Output() selectedChange = new EventEmitter();

    constructor() { }

    ngOnInit() { }

}
