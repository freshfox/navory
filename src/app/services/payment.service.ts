import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Payment} from "../models/payment";
import {BankAccount} from "../models/bank-account";

@Injectable()
export class PaymentService extends BaseService {

	private pathPayments = '/payments';
	private pathBankAccounts = '/bankaccounts';

	constructor(http: Http) {
		super(http);
	}

	getPayments(bankAccountId: string): Observable<Payment[]> {
		//let path = `/bankaccounts/${bankAccountId}/payments`;
		return this.get(this.pathPayments);
	}

	deletePayment(payment: Payment) {
		return this.delete(`${this.pathPayments}/${payment.id}`);
	}

	getBankAccounts(): Observable<BankAccount[]> {
		return this.get(this.pathBankAccounts);
	}
}
