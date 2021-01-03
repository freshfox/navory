import {NavoryApi} from './base.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import {Expense} from '../models/expense';
import {EuVatType} from '../core/enums/eu-vat-type.enum';
import {AnalyticsEventType} from './analytics.service';
import {map} from 'rxjs/operators';

@Injectable()
export class ExpenseService extends NavoryApi {

	private pathExpenses = '/expenses';

	constructor(http: Http) {
		super(http);
	}

	getExpenses(): Observable<Expense[]> {
		return this.get(this.pathExpenses)
			.pipe(map(data => {
				let expenses: Expense[] = [];
				data.forEach((expenseData) => {
					let expense = new Expense(expenseData);
					expenses.push(expense);
				});
				return expenses;
			}));
	}

	getExpense(id: number): Observable<Expense> {
		let path = this.pathExpenses + `/${id}`;
		return this.get(path)
			.pipe(map(data => {
				return new Expense(data);
			}));
	}

	saveExpense(expense: Expense): Observable<Expense> {
		if (expense.eu_vat_type == EuVatType.None) {
			expense.eu_vat_type = null;
		}

		if (!expense.id) {
			return this.post(this.pathExpenses, expense)
				.pipe(map(data => {
					return new Expense(data);
				}));
		}

		let path = this.pathExpenses + `/${expense.id}`;
		return this.patch(path, expense)
			.pipe(map(data => {
				return new Expense(data);
			}));
	}

	deleteExpense(expense: Expense): Observable<any> {
		return this.delete(this.getRestEntityPath(this.pathExpenses, expense.id));
	}

}

