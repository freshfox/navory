import {ApiService} from '@freshfox/ng-core';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Payment} from '../models/payment';
import {BankAccount} from '../models/bank-account';
import {Income} from '../models/income';
import {Expense} from '../models/expense';
import {Invoice} from '../models/invoice';
import {map} from 'rxjs/operators';

@Injectable()
export class PaymentService {

	private pathPayments = '/payments';
	private pathBankAccounts = '/bankaccounts';

	constructor(private apiService: ApiService) {

	}

	getPayments(): Observable<Payment[]> {
		return this.apiService.get(this.pathPayments);
	}

	deletePayment(payment: Payment) {
		return this.apiService.delete(`${this.pathPayments}/${payment.id}`);
	}

	getBankAccounts(): Observable<BankAccount[]> {
		return this.apiService.get(this.pathBankAccounts);
	}

	createBankAccount(account: BankAccount) {
		return this.apiService.post<BankAccount>(this.pathBankAccounts, account);
	}

	addPaymentToInvoice(invoiceId: string, payment: Payment): Observable<Payment> {
		let path = `/invoices/${invoiceId}/payments`;
		return this.apiService.post(path, payment)
			.pipe(map(this.parsePayment));
	}

	addPaymentToIncome(income: Income, payment: Payment) {
		let path = `/incomes/${income.id}/payments`;
		return this.apiService.post(path, payment)
			.pipe(map(this.parsePayment));
	}

	addPaymentToExpense(expense: Expense, payment: Payment) {
		let path = `/expenses/${expense.id}/payments`;
		return this.apiService.post(path, payment)
			.pipe(map(this.parsePayment));
	}

	removePaymentFromInvoice(invoice: Invoice, payment: Payment) {
		let path = `/invoices/${invoice.id}/payments/${payment.id}/link`;
		return this.apiService.delete(path);
	}

	removePaymentFromIncome(income: Income, payment: Payment) {
		let path = `/incomes/${income.id}/payments/${payment.id}/link`;
		return this.apiService.delete(path);
	}

	removePaymentFromExpense(expense: Expense, payment: Payment) {
		let path = `/expenses/${expense.id}/payments/${payment.id}/link`;
		return this.apiService.delete(path);
	}

	private parsePayment(data): Payment {
		return new Payment(data);
	}
}
