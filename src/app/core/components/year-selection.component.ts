import {Component, OnInit, EventEmitter} from "@angular/core";
import {Input, Output} from "@angular/core/src/metadata/directives";

@Component({
	selector: 'nvry-year-selection',
	template: `
      <div class="nvry-year-selection__inner">
        <button (click)="lastYear()">
            <nvry-icon name="arrow-left"></nvry-icon>
        </button>
        <span>{{ year }}</span>
        <button (click)="nextYear()">
            <nvry-icon name="arrow-right"></nvry-icon>
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
