import {BaseModel} from "../core/base.model";
import {BankAccount} from './bank-account';
import {Invoice} from './invoice';
import {Expense} from './expense';
import {Income} from './income';

export class Payment extends BaseModel {

	id: number;
	date: string;
	description: string;
	amount: number;
	_pivot_amount: number;
	bank_account_id: number;
	bank_account: BankAccount;
	remaining_amount: number;

	invoices: Invoice[];
	expenses: Expense[];
	incomes: Income[];

	constructor(data?: any) {
		super(data);
	}

	get pivot_amount(): number {
		return this._pivot_amount || this.amount;
	}
}
