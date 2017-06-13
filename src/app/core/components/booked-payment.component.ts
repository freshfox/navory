import {Component, OnInit, Input, EventEmitter, Output} from "@angular/core";
import {Payment} from "../../models/payment";

@Component({
	selector: 'nvry-booked-payment',
	host: {'class': 'booked-payment'},
	template: `
		<span class="description">
			{{ payment.description }}
		</span>
		<span class="date">
			{{ payment.date | nvryDate }}	
		</span>
		<span class="amount" [class.amount--expense]="isAmountNegative()">
			{{ amount() | ffNumber }}
		</span>
		<button ff-button class="button--xsmall button--secondary remove-button" (click)="onClickRemove()">{{ 'general.remove' | translate }}</button>
	`,
})
export class BookedPaymentComponent implements OnInit {

	@Input() payment: Payment;
	@Output() onRemove: EventEmitter<Payment> = new EventEmitter<Payment>();

	constructor() {
	}

	ngOnInit() {
	}

	amount() {
		return Math.abs(this.payment.pivot_amount);
	}

	isAmountNegative() {
		return this.payment.pivot_amount < 0;
	}

	onClickRemove() {
		this.onRemove.next(this.payment);
	}
}
