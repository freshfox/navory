import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Payment} from "../../models/payment";
import {IncomeService} from "../../services/income.service";
import {Income} from "../../models/income";

@Component({
	selector: 'nvry-invoice-book-payment',
	template: `
		<nvry-book-payment 	[amount]="amount" 
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

	constructor(private incomeService: IncomeService) {
	}

	private cancel() {
		this.onCancel.next();
	}

	private save(payment: Payment) {
		this.saving = true;
		this.incomeService.addPayment(this.income, payment)
			.subscribe((payment: Payment) => {
				this.onSaved.emit(payment);
				this.saving = false;
			});
	}

}
