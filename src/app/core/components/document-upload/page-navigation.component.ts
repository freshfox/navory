import {Component, OnInit, EventEmitter} from "@angular/core";
import {Input, Output} from "@angular/core/src/metadata/directives";

@Component({
	selector: 'nvry-page-navigation',
	template: `
        <button class="button prev-page-button" (click)="previousPage()">
            <nvry-icon name="arrow-left"></nvry-icon>
        </button>
        <span class="page-count">
            <span class="current-page">{{ currentPageIndex + 1 }}</span> / {{ numberOfPages }}
        </span>
        <button class="button" (click)="nextPage()">
            <nvry-icon name="arrow-right"></nvry-icon>
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
		this.currentPageIndex = ((this.currentPageIndex + 1) + this.numberOfPages) % this.numberOfPages;
		this.currentPageIndexChange.emit(this.currentPageIndex);
	}

	private previousPage() {
		this.goToPage(this.currentPageIndex - 1);
	}

	private nextPage() {
		this.goToPage(this.currentPageIndex + 1);
	}

}
