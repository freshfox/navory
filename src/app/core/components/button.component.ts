import {Component, ElementRef, Input, SimpleChange, AfterViewInit, OnChanges} from "@angular/core";
let Ladda = require('ladda');

@Component({
	selector: 'nvry-button',
	template: `
		<button class="button {{ class }}" data-style="zoom-in" [attr.disabled]="disabled ? true : null">
		    <nvry-icon *ngIf="icon" [name]="icon"></nvry-icon>
		    <span class="ladda-label">
			    <ng-content></ng-content>
		    </span>
		</button>`
})
export class ButtonComponent implements AfterViewInit, OnChanges {

	@Input() loading;
	@Input() class;
	@Input() icon: string;
	@Input() disabled: boolean = false;

	private laddaButton: any;

	constructor(private el: ElementRef) {
	}

	ngAfterViewInit() {
		if (typeof this.loading !== 'undefined') {
			this.laddaButton = Ladda.create(this.el.nativeElement.querySelector('button'));
			this.updateLoadingState(this.loading);
		}
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		for (let propName in changes) {
			if (propName === 'loading') {
				let changedProp = changes[propName];
				this.updateLoadingState(changedProp.currentValue);
			}
		}
	}

	updateLoadingState(newLoadingState) {
		if (this.laddaButton) {
			if (newLoadingState) {
				this.laddaButton.start();
			} else {
				this.laddaButton.stop();
			}
		}
	}

}
