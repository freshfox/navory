import {Component, OnInit, EventEmitter, Input, Output} from "@angular/core";

@Component({
	selector: 'nvry-year-selection',
	template: `
      <div class="nvry-year-selection__inner">
        <button (click)="lastYear()">
            <ff-icon name="arrow-left"></ff-icon>
        </button>
        <span>{{ year }}</span>
        <button (click)="nextYear()">
            <ff-icon name="arrow-right"></ff-icon>
        </button>
     </div>
    `
})
export class YearSelectionComponent implements OnInit {

	@Input() year: number;
	@Output() yearChange: EventEmitter<number> = new EventEmitter<number>()

	constructor() {
	}

	ngOnInit() {

	}

	nextYear() {
		this.changeYear(this.year + 1);
	}

	lastYear() {
		this.changeYear(this.year - 1);
	}

	changeYear(newYear: number) {
		this.year = newYear;
		this.yearChange.emit(this.year);
	}

}
