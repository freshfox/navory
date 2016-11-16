import {Component, OnInit, EventEmitter} from '@angular/core';
import * as moment from 'moment';
import {Input, Output} from "@angular/core/src/metadata/directives";

@Component({
    selector: 'nvry-month-selection',
    template: `
        <ul>
            <li *ngFor="let month of months; let i = index;" [class.selected]="i == selectedMonthIndex">
                <button (click)="monthClicked(i)">{{ month }}</button>
            </li>
        </ul>
    `
})
export class MonthSelectionComponent implements OnInit {

    @Input() selectedMonthIndex: number = 0;
    @Output() selectedMonthIndexChange: EventEmitter<number> = new EventEmitter<number>();
    private months: string[];

    constructor() {

        this.months = moment.monthsShort();
    }

    ngOnInit() { }

    monthClicked(index) {
        this.selectedMonthIndex = index;
        this.selectedMonthIndexChange.emit(this.selectedMonthIndex);
    }

}
