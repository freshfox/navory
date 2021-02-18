import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Payment} from '../../models/payment';

@Component({
	selector: 'nvry-payment',
	template: `
		<div class="w-full flex items-center justify-between">
			<div class="w-1/4">
				{{ payment.description }}
			</div>
			<div class="w-1/4">
				{{ payment.date | nvryDate }}
			</div>
			<div class="font-medium ml-auto text-green-500" [class.text-red-500]="isAmountNegative()">
				{{ amount() | ffNumber }}
			</div>

			<ng-content></ng-content>
		</div>
	`,
})
export class PaymentComponent implements OnInit {

	@Input() payment: Payment;

	@HostBinding('class') clazz = 'block rounded px-6 py-4 bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-400'

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
}
