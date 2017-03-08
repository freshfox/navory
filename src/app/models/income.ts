import {File} from "./file";
import {Category} from "./category";
import {TaxRate} from "./tax-rate";
import {EuVatType} from "../core/enums/eu-vat-type.enum";
import {Payment} from "./payment";
import {Calculator} from "../core/calculator";
import {BaseModel} from "../core/base.model";

export class Income extends BaseModel {

	id: number;
	number: number;
	date: string;
	description: string;
	category: Category;
	price: number;
	tax_rate: TaxRate;
	file: File;
	eu_vat_type: EuVatType;
	payments: Payment[];

	constructor(data?: any) {
		super(data);
		this.price = this.price || 0;

		if (this.payments) {
			this.payments = this.payments.map(data => new Payment(data));
		} else {
			this.payments = [];
		}
	}

	get isFullyPaid(): boolean {
		return this.unpaid_amount <= 0;
	}

	getAmountGross(): number {
		return Calculator.add(this.price, this.getTaxAmount());
	}

	getTaxAmount(): number {
		return this.price * this.getTaxrate() / 100;
	}

	getTaxrate(): number {
		let taxrate = this.tax_rate;
		if (taxrate) {
			return taxrate.rate;
		}

		return null;
	}

	private _unpaid_amount: number;
	get unpaid_amount(): number {
		if (!this.payments) {
			return this.getAmountGross();
		}

		let paidAmount = 0;
		this.payments.forEach((payment: Payment) => {
			paidAmount = Calculator.add(paidAmount, payment.pivot_amount);
		});

		return Calculator.sub(this.getAmountGross(), paidAmount);
	}

	set unpaid_amount(amount: number) {
		this._unpaid_amount = amount;
	}

}
