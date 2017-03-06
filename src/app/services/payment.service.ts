import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Payment} from "../models/payment";
import {BankAccount} from "../models/bank-account";
import {Income} from "../models/income";
import {Expense} from "../models/expense";

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

	addPaymentToInvoice(invoiceId: string, payment: Payment): Observable<Payment> {
		let path = `/invoices/${invoiceId}/payments`;
		return this.post(path, payment)
			.map(this.parsePayment);
	}

	addPaymentToIncome(income: Income, payment: Payment) {
		let path = `/incomes/${income.id}/payments`;
		return this.post(path, payment)
			.map(this.parsePayment);
	}

	addPaymentToExpense(expense: Expense, payment: Payment) {
		let path = `/expenses/${expense.id}/payments`;
		return this.post(path, payment)
			.map(this.parsePayment);
	}

	private parsePayment(data): Payment {
		return new Payment(data);
	}
}
