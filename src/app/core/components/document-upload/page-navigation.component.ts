import {Component, OnInit, EventEmitter, Input, Output} from "@angular/core";

@Component({
	selector: 'nvry-page-navigation',
	template: `
        <button class="button prev-page-button" (click)="previousPage()">
            <ff-icon name="arrow-left"></ff-icon>
        </button>
        <span class="page-count">
            <span class="current-page">{{ currentPageIndex + 1 }}</span> / {{ numberOfPages }}
        </span>
        <button class="button" (click)="nextPage()">
            <ff-icon name="arrow-right"></ff-icon>
        </button>
`
})
export class PageNavigationComponent implements OnInit {

	@Input() numberOfPages: number;
	@Input() currentPageIndex: number;
	@Output() currentPageIndexChange: EventEmitter<number> = new EventEmitter<number>()

	constructor() {
	}

	ngOnInit() {
	}

	private goToPage(pageIndex: number) {
		this.currentPageIndex = (pageIndex + this.numberOfPages) % this.numberOfPages;

		this.currentPageIndexChange.emit(this.currentPageIndex);
	}

	previousPage() {
		this.goToPage(this.currentPageIndex - 1);
	}

	nextPage() {
		this.goToPage(this.currentPageIndex + 1);
	}

}
