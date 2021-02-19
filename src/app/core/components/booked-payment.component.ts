import {Component, OnInit, Input, EventEmitter, Output, HostBinding} from '@angular/core';
import {Payment} from "../../models/payment";

@Component({
	selector: 'nvry-booked-payment',
	template: `
		<nvry-payment [payment]="payment">
			<button ff-button class="ff-button--xsmall ff-button--secondary ml-8" (click)="onClickRemove()">{{ 'general.remove' | translate }}</button>
		</nvry-payment>
	`,
})
export class BookedPaymentComponent implements OnInit {

	@Input() payment: Payment;
	@Output() onRemove: EventEmitter<Payment> = new EventEmitter<Payment>();

	@HostBinding('class') clazz = 'block';

	constructor() {
	}

	ngOnInit() {
	}

	onClickRemove() {
		this.onRemove.next(this.payment);
	}
}
