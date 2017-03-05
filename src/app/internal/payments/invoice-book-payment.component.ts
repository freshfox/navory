import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Payment} from "../../models/payment";
import {InvoiceService} from "../../services/invoice.service";

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
export class InvoiceBookPaymentComponent {

	@Input() invoiceId: string;
	@Input() amount: number;
	@Input() description: string;

	@Output() onSaved: EventEmitter<Payment> = new EventEmitter<Payment>();
	@Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

	private saving: boolean = false;

	constructor(private invoiceService: InvoiceService) {
	}

	private cancel() {
		this.onCancel.next();
	}

	private save(payment: Payment) {
		this.saving = true;
		this.invoiceService.addPayment(this.invoiceId, payment)
			.subscribe((payment: Payment) => {
				this.onSaved.emit(payment);
				this.saving = false;
			});
	}

}
