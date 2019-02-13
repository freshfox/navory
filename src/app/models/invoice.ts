import {Calculator} from '../core/calculator';
import {Payment} from './payment';
import {BaseInvoice} from './invoice-base.model';

export class Invoice extends BaseInvoice {

	due_date: string;
	service_date_start: string;
	service_date_end: string;
	payments: Payment[];
	canceled: boolean;
	locale: string;
	group_prefix: number;

	constructor(data?: any) {
		super(data);

		if (this.payments) {
			this.payments = this.payments.map(data => new Payment(data));
		} else {
			this.payments = [];
		}

		this.initLines('invoice_lines');
	}

	get isFullyPaid(): boolean {
		return this.unpaid_amount <= 0;
	}

	_unpaid_amount: number;
	get unpaid_amount(): number {
		if (!this.payments) {
			return this._unpaid_amount;
		}

		let paidAmount = 0;
		this.payments.forEach((payment: Payment) => {
			paidAmount = Calculator.add(paidAmount, payment.pivot_amount);
		});

		return Calculator.sub(this.getTotalGross(), paidAmount);
	}

	set unpaid_amount(amount: number) {
		this._unpaid_amount = amount;
	}
}

export enum InvoiceStatus {
	Draft = 'draft' as any,
	Canceled = 'canceled' as any,
	Issued = 'issued' as any,
	PartlyPaid = 'partly-paid' as any,
	Paid = 'paid' as any,
	Overdue = 'overdue' as any
}

