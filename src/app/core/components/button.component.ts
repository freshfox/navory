import {Component, ElementRef, Input, SimpleChange, AfterViewInit, OnChanges, OnDestroy} from "@angular/core";
let Ladda = require('ladda');

@Component({
	selector: 'nvry-button',
	template: `
		<button class="button {{ class }}" data-style="zoom-in" [attr.disabled]="disabled ? true : null">
			<div class="button__inner">
				<nvry-icon *ngIf="icon" [name]="icon"></nvry-icon>
				<span class="ladda-label">
					<ng-content></ng-content>
				</span>
			</div>
		   
		</button>`
})
export class ButtonComponent implements AfterViewInit, OnChanges, OnDestroy {

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

	ngOnDestroy() {
		if(this.laddaButton) {
			this.laddaButton.remove();
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
