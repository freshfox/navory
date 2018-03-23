import {File} from "./file";
import {Category} from "./category";
import {TaxRate} from "./tax-rate";
import {EuVatType} from "../core/enums/eu-vat-type.enum";
import {Calculator} from "../core/calculator";
import {Payment} from "./payment";
import {BaseModel} from "../core/base.model";

export class Expense extends BaseModel {

	id: string;
	number: number;
	date: string;
	description: string;
	price: number;
	file: File;
	tax_rate: TaxRate;
	eu_tax_rate: TaxRate;
	eu_vat_type: EuVatType;
	category: Category;
	payments: Payment[];

	constructor(data?: any) {
		super(data);
		this.price = this.price || 0;

		this.category = this.category || {} as any;

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
			return this._unpaid_amount;
		}

		let paidAmount = 0;
		this.payments.forEach((payment: Payment) => {
			paidAmount = Calculator.add(paidAmount, payment.pivot_amount);
		});

		return Calculator.add(this.getAmountGross(), paidAmount);
	}

	set unpaid_amount(amount: number) {
		this._unpaid_amount = amount;
	}

}
