import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from '@angular/core';
import {Payment} from '../../models/payment';

@Component({
	selector: 'nvry-payment',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full flex items-center justify-between dark:text-white">
			<div class="w-1/4">
				{{ payment.description }}
			</div>
			<div class="w-1/4">
				{{ payment.date | nvryDate }}
			</div>
			<div class="font-medium ml-auto" [class.text-green-500]="!isAmountNegative()" [class.text-red-500]="isAmountNegative()">
				{{ amount | ffNumber }}
			</div>

			<ng-content></ng-content>
		</div>
	`,
})
export class PaymentComponent implements OnInit {

	@Input() payment: Payment;
	@Input() showAmount: 'pivot' | 'remaining' = 'pivot';

	@HostBinding('class') clazz = 'block rounded px-6 py-4 bg-gray-100 dark:bg-gray-700 dark:border dark:border-gray-300'

	constructor() {
	}

	ngOnInit() {
	}

	get amount() {
		return this.showAmount === 'pivot' ? this.payment.pivot_amount : this.payment.remaining_amount;
	}

	isAmountNegative() {
		return this.amount < 0;
	}
}
