import {Component, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
	selector: 'ff-spinner',
	template: `
		<mat-spinner mode="indeterminate"
							 *ngIf="progress >= 100 || progress === undefined"></mat-spinner>
		<mat-spinner mode="determinate" [value]="progress"
							 *ngIf="progress > 0 && progress < 100"></mat-spinner>`,
	host: {
		'class': 'ff-spinner'
	}
})
export class SpinnerComponent implements OnInit, OnDestroy {

	@Input() progress: number;
	private interval;

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
