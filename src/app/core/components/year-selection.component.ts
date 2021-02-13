import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'nvry-year-selection',
	template: `
		<div class="nvry-year-selection__inner">
			<div class="relative z-0 inline-flex shadow-sm rounded-md">
				<button type="button" (click)="lastYear()"
						class="relative inline-flex items-center px-4 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
					<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
					</svg>
				</button>
				<div class="-ml-px relative inline-flex items-center px-4 py-1.5 w-20 justify-center text-center border border-gray-300 bg-white text-sm font-medium text-gray-700">
					{{ year }}
				</div>
				<button type="button" (click)="nextYear()"
						class="-ml-px relative inline-flex items-center px-4 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
					<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clih-rule="evenodd" />
					</svg>
				</button>
			</div>
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
