import {BaseModel} from "../core/base.model";
import {BankAccount} from "./bank-account";

export class Payment extends BaseModel {

	id: number;
	date: string;
	description: string;
	amount: number;
	bank_account: BankAccount;

}
