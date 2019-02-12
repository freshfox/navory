import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'ff-dropdown',
	template: `
		<div class="dropdown__inner" (click)="onClickInner($event)">
			<button class="ff-button dropdown-target" (click)="toggle($event)">
				<div class="ff-button__inner">
					<ff-icon name="more"></ff-icon>
					<span *ngIf="text">{{ text }}</span>
				</div>
			</button>
			<div class="dropdown-content" *ngIf="shown" (click)="hide()">
				<ng-content></ng-content>
			</div>
		</div>
		<div class="dropdown-overlay" (click)="onClickOverlay($event)" *ngIf="shown"></div>
	`,
	host: {
		'class': 'ff-dropdown',
		'[class.ff-dropdown--shown]': 'shown',
		'[class.ff-dropdown--text]': 'text',
	}
})
export class DropdownComponent implements OnInit {

	shown: boolean = false;
	@Input() text: string;
	//@Input() icon: string = 'more';

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
