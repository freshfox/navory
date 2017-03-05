import {Component, OnInit, Input} from "@angular/core";
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
			{{ amount() | nvryNumber }}
		</span>
	`,
})
export class BookedPaymentComponent implements OnInit {

	@Input() private payment: Payment;

	constructor() {
	}

	ngOnInit() {
	}

	private amount() {
		return Math.abs(this.payment.amount);
	}

	private isAmountNegative() {
		return this.payment.amount < 0;
	}

}
