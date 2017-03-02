import {InvoiceLine} from "./invoice-line";
import {BaseModel} from "../core/base.model";
import {Calculator} from "../core/calculator";
import {Payment} from "./payment";

export class Invoice extends BaseModel {

	id: number;
	number: number;
	draft: boolean;
	date: string;
	due_date: string;
	service_date_start: string;
	service_date_end: string;
	invoice_lines: InvoiceLine[];
	customer_name: string;
	customer_address: string;
	customer_country_id: number;
	customer_vat_number: string;
	unpaid_amount: number;
	payments: Payment[];

	constructor(data?: any) {
		super(data);

		if (this.invoice_lines) {
			this.invoice_lines = this.invoice_lines.map(currentLine => new InvoiceLine(currentLine));
		} else {
			this.invoice_lines = [];
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
}

export enum InvoiceStatus {
	Draft = 'draft' as any,
	Issued = 'issued' as any,
	PartlyPaid = 'partly-paid' as any,
	Paid = 'paid' as any,
	Overdue = 'overdue' as any
}

