import {Component, OnInit, Input, Output} from "@angular/core";

@Component({
	selector: 'nvry-confirm',
	template: `
        <div class="modal-header" *ngIf="title">
            {{ title }}
        </div>
    
        <div class="modal-inner">
            <p class="nmb">{{ message }}</p>
        </div>
        
        <div class="modal-footer">
            <nvry-button class="button--secondary" (click)="cancel()">{{ 'general.cancel' | translate }}</nvry-button>
            <nvry-button (click)="confirm()">{{ 'general.delete' | translate }}</nvry-button>
        </div> 
    `
})
export class ConfirmComponent implements OnInit {

	@Input() title: string;
	@Input() message: string;

	@Output() onCancel: Function;
	@Output() onConfirm: Function;

	constructor() {
	}

	ngOnInit() {
	}

	confirm() {
		this.onConfirm();
	}

	cancel() {
		this.onCancel();
	}

}
