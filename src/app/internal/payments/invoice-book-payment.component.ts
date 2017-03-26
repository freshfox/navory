import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Payment} from "../../models/payment";
import {PaymentService} from "../../services/payment.service";

@Component({
	selector: 'nvry-invoice-book-payment',
	template: `
		<nvry-book-payment 	[headline]="'general.book-incoming-payment' | translate"
							[amount]="amount" 
							[description]="description" 
							[saving]="saving" 
							(onSave)="save($event)"
							(onCancel)="cancel()"></nvry-book-payment>
	`
})
export class InvoiceBookPaymentComponent {

	@Input() invoiceId: string;
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
		this.paymentService.addPaymentToInvoice(this.invoiceId, payment)
			.subscribe((payment: Payment) => {
				this.onSaved.emit(payment);
				this.saving = false;
			});
	}

}
