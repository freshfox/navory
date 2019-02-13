import {NavoryApi} from "./base.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Payment} from "../models/payment";
import {BankAccount} from "../models/bank-account";
import {Income} from "../models/income";
import {Expense} from "../models/expense";
import {Invoice} from "../models/invoice";
import {map} from 'rxjs/operators';

@Injectable()
export class PaymentService extends NavoryApi {

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
			.pipe(map(this.parsePayment));
	}

	addPaymentToIncome(income: Income, payment: Payment) {
		let path = `/incomes/${income.id}/payments`;
		return this.post(path, payment)
			.pipe(map(this.parsePayment));
	}

	addPaymentToExpense(expense: Expense, payment: Payment) {
		let path = `/expenses/${expense.id}/payments`;
		return this.post(path, payment)
			.pipe(map(this.parsePayment));
	}

	removePaymentFromInvoice(invoice: Invoice, payment: Payment) {
		let path = `/invoices/${invoice.id}/payments/${payment.id}/link`;
		return this.delete(path);
	}

	removePaymentFromIncome(income: Income, payment: Payment) {
		let path = `/incomes/${income.id}/payments/${payment.id}/link`;
		return this.delete(path);
	}

	removePaymentFromExpense(expense: Expense, payment: Payment) {
		let path = `/expenses/${expense.id}/payments/${payment.id}/link`;
		return this.delete(path);
	}

	private parsePayment(data): Payment {
		return new Payment(data);
	}
}
