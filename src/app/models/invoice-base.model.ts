import {InvoiceLine} from "./invoice-line";
import {BaseModel} from "../core/base.model";
import {Calculator} from "../core/calculator";
import {Customer} from "./customer";

export class BaseInvoice extends BaseModel {

	id: string;
	number: number;
	draft: boolean;
	date: string;
	comment: string;
	invoice_lines: InvoiceLine[];

	customer: Customer;
	customer_name: string;
	customer_address: string;
	customer_country_code: string;
	customer_vat_number: string;

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

