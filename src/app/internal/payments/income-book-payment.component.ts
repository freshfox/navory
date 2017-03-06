import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Payment} from "../../models/payment";
import {Income} from "../../models/income";
import {PaymentService} from "../../services/payment.service";

@Component({
	selector: 'nvry-income-book-payment',
	template: `
		<nvry-book-payment 	[headline]="'general.book-incoming-payment' | translate"
							[amount]="amount" 
							[description]="description" 
							[saving]="saving" 
							(onSave)="save($event)"
							(onCancel)="cancel()"></nvry-book-payment>
	`
})
export class IncomeBookPaymentComponent {

	@Input() income: Income;
	@Input() amount: number;
	@Input() description: string;

	@Output() onSaved: EventEmitter<Payment> = new EventEmitter<Payment>();
	@Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

	private saving: boolean = false;

	constructor(private paymentService: PaymentService) {
	}

	private cancel() {
		this.onCancel.next();
	}

	private save(payment: Payment) {
		this.saving = true;
		this.paymentService.addPaymentToIncome(this.income, payment)
			.subscribe((payment: Payment) => {
				this.onSaved.emit(payment);
				this.saving = false;
			});
	}

}
