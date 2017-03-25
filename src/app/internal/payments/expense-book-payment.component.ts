import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Payment} from "../../models/payment";
import {Expense} from "../../models/expense";
import {PaymentService} from "../../services/payment.service";

@Component({
	selector: 'nvry-expense-book-payment',
	template: `
		<nvry-book-payment 	[headline]="'general.book-outgoing-payment' | translate"
							[amount]="amount" 
							[description]="description" 
							[saving]="saving" 
							(onSave)="save($event)"
							[isExpenseBooking]="true"
							(onCancel)="cancel()"></nvry-book-payment>
	`
})
export class ExpenseBookPaymentComponent {

	@Input() expense: Expense;
	@Input() amount: number;
	@Input() description: string;

	@Output() onSaved: EventEmitter<Payment> = new EventEmitter<Payment>();
	@Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

	saving: boolean = false;

	constructor(private paymentService: PaymentService) {
	}

	cancel() {
		this.onCancel.next();
	}

	save(payment: Payment) {
		this.saving = true;
		this.paymentService.addPaymentToExpense(this.expense, payment)
			.subscribe((payment: Payment) => {
				this.onSaved.emit(payment);
				this.saving = false;
			});
	}

}
