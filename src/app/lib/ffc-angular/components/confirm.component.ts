import {Component, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'ff-confirm',
	template: `
		<div class="modal-header" *ngIf="title">
			{{ title }}
		</div>

		<div class="modal-inner">
			<p class="nmb">{{ message }}</p>
		</div>

		<div class="modal-footer">
			<button ff-button class="ff-button--secondary" (click)="cancel()">Abbrechen</button>
			<button ff-button (click)="confirm()">{{ confirmText }}</button>
		</div>
	`
})
export class ConfirmComponent implements OnInit {

	@Input() title: string;
	@Input() message: string;
	@Input() confirmText: string;

	@Output() onCancel: Function;
	@Output() onConfirm: Function;

	constructor() {
	}

	ngOnInit() {
		if(!this.confirmText) {
			this.confirmText = 'Löschen';
		}
	}

	confirm() {
		this.onConfirm();
	}

	cancel() {
		this.onCancel();
	}

}
