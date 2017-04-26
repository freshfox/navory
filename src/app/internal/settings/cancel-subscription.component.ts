import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SubscriptionService} from "../../services/subscription.service";

@Component({
	selector: 'nvry-cancel-subscription',
	template: `
		<div class="modal-header">
			Kündige deinen Plan
		</div>
		<div class="modal-inner">
			<p>
				Du kannst Navory in deinem aktiven Plan noch bis zum Ende deiner Abrechnungsperiode verwenden.
			</p>
			<p class="nmb">
				Danach behältst du weiterhin Zugang zu Navory und deinen Daten, allerdings wirst du keine kostenpflichtigen Funktionen mehr verwenden können.
			</p>
		</div>
		<div class="modal-footer">
			<nvry-button class="button--secondary" (click)="cancelClicked()">{{ 'general.cancel' | translate }}</nvry-button>
			<nvry-button class="button--danger" (click)="cancelSubscription()" [loading]="sending">Plan endgültig kündigen</nvry-button>
		</div>
	`
})
export class CancelSubscriptionComponent implements OnInit {

	private sending: boolean = false;

	@Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
	@Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();

	constructor(private subscriptionService: SubscriptionService) {
	}

	ngOnInit() {
	}

	cancelSubscription() {
		this.sending = true;
		this.subscriptionService.cancelSubscription()
			.subscribe(() => {
				this.sending = false;
				this.onSuccess.next();
			});
	}

	cancelClicked() {
		this.onCancel.next();
	}
}
