import {Component, Input} from '@angular/core';

@Component({
	selector: 'ff-alert-bar',
	template: `
		<div class="alert visible" [ngClass]="getClasses()" *ngIf="message">
			<div class="msg" [innerHTML]="message"></div>
		</div>`,
	host: {
		'class': 'ff-alert-bar'
	}
})
export class AlertBarComponent {
	@Input() message: string;
	@Input() type: AlertBarType = AlertBarType.Error;

	getClasses() {
		return {
			'alert--success': this.type === AlertBarType.Success,
			'alert--warning': this.type === AlertBarType.Warning
		}
	}
}

export enum AlertBarType {
	Success = 'success' as any,
	Warning = 'warning' as any,
	Error = 'error' as any
}
