import {InvoiceLine} from "./invoice-line";
import {BaseModel} from "../core/base.model";
import {Calculator} from "../core/calculator";
import {Payment} from "./payment";
import {Customer} from "./customer";

export class Invoice extends BaseModel {

	id: string;
	number: number;
	draft: boolean;
	date: string;
	due_date: string;
	service_date_start: string;
	service_date_end: string;
	comment: string;
	invoice_lines: InvoiceLine[];

	customer: Customer;
	customer_name: string;
	customer_address: string;
	customer_country_id: string;
	customer_vat_number: string;
	payments: Payment[];

	constructor(data?: any) {
		super(data);

		if (this.invoice_lines) {
			this.invoice_lines = this.invoice_lines.map(currentLine => new InvoiceLine(currentLine));
		} else {
			this.invoice_lines = [];
		}

		if (this.payments) {
			this.payments = this.payments.map(data => new Payment(data));
		} else {
			this.payments = [];
		}
	}

	getTotalNet(): number {
		var amount = 0;
		this.invoice_lines.forEach(invoiceLine => {
			amount = Calculator.add(amount, invoiceLine.getNetAmount());
		});

		return amount;
	}

	getTotalGross(): number {
		var amount = 0;
		this.invoice_lines.forEach(invoiceLine => {
			amount = Calculator.add(amount, invoiceLine.getGrossAmount());
		});

		return amount;
	}

	isIssued(): boolean {
		return !this.draft;
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
	Issued = 'issued' as any,
	PartlyPaid = 'partly-paid' as any,
	Paid = 'paid' as any,
	Overdue = 'overdue' as any
}

