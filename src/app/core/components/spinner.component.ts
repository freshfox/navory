import {Component, OnInit, SimpleChange, OnDestroy, Input} from "@angular/core";

@Component({
	selector: 'nvry-spinner',
	template: `
		<md-progress-circle mode="indeterminate" *ngIf="progress >= 100 || progress === undefined"></md-progress-circle>
        <md-progress-circle mode="determinate" [value]="progress" *ngIf="progress > 0 && progress < 100"></md-progress-circle>`
})
export class SpinnerComponent implements OnInit, OnDestroy {

	@Input() progress: number;

	private interval;

	constructor() {
	}

	ngOnInit() {
		this.interval = setInterval(() => {
			return this.progress;
		}, 200);
	}

	ngOnDestroy() {
		clearInterval(this.interval);
		this.interval = null;
	}

}
