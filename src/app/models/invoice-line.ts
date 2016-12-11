import {TaxRate} from "./tax-rate";
import {BaseModel} from "../core/base.model";
import {Calculator} from "../core/calculator";

export class InvoiceLine extends BaseModel {

	id: number;
	title: string;
	description: string;
	quantity: number;
	price: number;
	tax_rate_id: number;
	tax_rate: TaxRate;
	unit_id: number;

	constructor(data?: any) {
		super(data);
		this.price = this.price || 0;
		this.quantity = this.quantity || 1;
	}

	getNetAmount(): number {
		return Calculator.toCents(this.price) * this.quantity / 100;
	}

	getGrossAmount(): number {
		return Calculator.add(this.getNetAmount(), this.getTaxAmount());
	}

	getTaxAmount(): number {
		return this.getNetAmount() * this.getTaxrate() / 100;
	}

	getTaxrate(): number {
		let taxrate = this.tax_rate;
		if (taxrate) {
			return taxrate.rate;
		}

		return null;
	}

}
