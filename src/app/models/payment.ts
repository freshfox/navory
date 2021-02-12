import {BaseModel} from "../core/base.model";
import {BankAccount} from './bank-account';

export class Payment extends BaseModel {

	id: number;
	date: string;
	description: string;
	amount: number;
	_pivot_amount: number;
	bank_account_id: number;
	bank_account: BankAccount;
	remaining_amount: number;

	get pivot_amount(): number {
		return this._pivot_amount || this.amount;
	}
}
