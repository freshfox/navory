import {Line} from "./invoice-line";
import {BaseModel} from "../core/base.model";
import {Calculator} from "../core/calculator";
import {Customer} from "./customer";
import {InvoiceUtils} from '../utils/invoice-utils';
import {LineUtils} from '../utils/line-utils';

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
			return;
		}
		
		if (this[apiLinesPropertyName]) {
			this.lines = this[apiLinesPropertyName];
		}
		else {
			this.lines = [];
		}
	}

	getTotalNet(): number {
		return LineUtils.getTotalNet(this.lines);
	}

	getTotalGross(): number {
		return LineUtils.getTotalGross(this.lines);
	}
}

