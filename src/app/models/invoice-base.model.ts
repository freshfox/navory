import {Line} from "./invoice-line";
import {BaseModel} from "../core/base.model";
import {Calculator} from "../core/calculator";
import {Customer} from "./customer";

export class BaseInvoice extends BaseModel {

	id: string;
	number: number;
	draft: boolean;
	date: string;
	comment: string;
	lines: Line[];

	customer: Customer;
	customer_name: string;
	customer_address: string;
	customer_country_code: string;
	customer_vat_number: string;

	constructor(data?: any) {
		super(data);
	}

	protected initLines(apiLinesPropertyName: string) {
		if (this.lines) {
			this.lines = this.lines.map(currentLine => new Line(currentLine));
		}
		else if (this[apiLinesPropertyName]) {
			this.lines = this[apiLinesPropertyName].map(currentLine => new Line(currentLine));
		}
		else {
			this.lines = [];
		}
	}

	getTotalNet(): number {
		var amount = 0;
		this.lines.forEach(invoiceLine => {
			amount = Calculator.add(amount, invoiceLine.getNetAmount());
		});

		return amount;
	}

	getTotalGross(): number {
		var amount = 0;
		this.lines.forEach(invoiceLine => {
			amount = Calculator.add(amount, invoiceLine.getGrossAmount());
		});

		return amount;
	}

	isIssued(): boolean {
		return !this.draft;
	}
}

