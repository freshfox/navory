import {BaseService} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {Expense} from "../models/expense";
import {EuVatType} from "../core/enums/eu-vat-type.enum";
import {Payment} from "../models/payment";
import {AnalyticsEventType, AnalyticsService} from "./analytics.service";

@Injectable()
export class ExpenseService extends BaseService {

	private pathExpenses = '/expenses';

	constructor(http: Http, private analytics: AnalyticsService) {
		super(http);
	}

	getExpenses(): Observable<Expense[]> {
		return this.get(this.pathExpenses)
			.map(data => {
				let expenses: Expense[] = [];
				data.forEach((expenseData) => {
					let expense = new Expense(expenseData);
					expenses.push(expense);
				});
				return expenses;
			});;
	}

	getExpense(id: number): Observable<Expense> {
		let path = this.pathExpenses + `/${id}`;
		return this.get(path)
			.map(data => {
				return new Expense(data);
			});
	}

	saveExpense(expense: Expense): Observable<Expense> {
		if (expense.eu_vat_type == EuVatType.None) {
			expense.eu_vat_type = null;
		}

		if (!expense.id) {
			return this.post(this.pathExpenses, expense)
				.map(data => {
					this.analytics.trackEvent(AnalyticsEventType.ExpenseCreate);
					return new Expense(data);
				});
		}

		let path = this.pathExpenses + `/${expense.id}`;
		return this.patch(path, expense)
			.map(data => {
				this.analytics.trackEvent(AnalyticsEventType.ExpenseUpdate);
				return new Expense(data);
			});
	}

	deleteExpense(expense: Expense): Observable<any> {
		this.analytics.trackEvent(AnalyticsEventType.ExpenseDelete);
		return this.delete(this.getRestEntityPath(this.pathExpenses, expense.id));
	}

}

