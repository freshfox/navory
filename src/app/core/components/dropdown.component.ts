import {Component, OnInit} from "@angular/core";

@Component({
	selector: 'nvry-dropdown',
	template: `
        <div class="dropdown__inner" (click)="onClickInner($event)">
            <button class="dropdown-target" (click)="toggle($event)">
                <ff-icon name="more" [class.rotate-180-deg]="shown"></ff-icon>
            </button>
            <div class="dropdown-content" *ngIf="shown" (click)="hide()">
                <ng-content></ng-content>
            </div>
        </div>
        <div class="dropdown-overlay" (click)="onClickOverlay($event)" *ngIf="shown"></div>
    `,
	host: {
		'[class.dropdown--shown]': 'shown'
	}
})
export class DropdownComponent implements OnInit {

	shown: boolean = false;

	constructor() {
	}

	ngOnInit() {
	}

	toggle(event) {
		this.shown = !this.shown;
		event.stopPropagation();
	}

	hide() {
		this.shown = false;
	}

	onClickOverlay(event) {
		this.hide();
		event.stopPropagation();
	}

	onClickInner(event) {
		event.stopPropagation();
	}
}
