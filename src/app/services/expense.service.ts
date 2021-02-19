import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from '@freshfox/ng-core';
import {Expense} from '../models/expense';
import {EuVatType} from '../core/enums/eu-vat-type.enum';
import {map} from 'rxjs/operators';

@Injectable()
export class ExpenseService {

	private pathExpenses = '/expenses';

	constructor(private apiService: ApiService) {

	}

	getExpenses(): Observable<Expense[]> {
		return this.apiService.get(this.pathExpenses)
			.pipe(map((data: any[]) => {
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
		return this.apiService.get(path)
			.pipe(map(data => {
				return new Expense(data);
			}));
	}

	saveExpense(expense: Expense): Observable<Expense> {
		if (expense.eu_vat_type == EuVatType.None) {
			expense.eu_vat_type = null;
		}

		if (!expense.id) {
			return this.apiService.post(this.pathExpenses, expense)
				.pipe(map(data => {
					return new Expense(data);
				}));
		}

		let path = this.pathExpenses + `/${expense.id}`;
		return this.apiService.patch(path, expense)
			.pipe(map(data => {
				return new Expense(data);
			}));
	}

	deleteExpense(expense: Expense): Observable<any> {
		return this.apiService.delete(this.apiService.getRestEntityPath(this.pathExpenses, expense.id + ''));
	}

}

