import {BaseService} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Income} from "../models/income";
import {Http} from "@angular/http";
import {EuVatType} from "../core/enums/eu-vat-type.enum";
import {Payment} from "../models/payment";

@Injectable()
export class IncomeService extends BaseService {

	private pathIncome = '/incomes';

	constructor(http: Http) {
		super(http);
	}

	getIncomes(): Observable<Income[]> {
		return this.get(this.pathIncome);
	}

	getIncome(id: string): Observable<Income> {
		return this.get(this.getRestEntityPath(this.pathIncome, id))
			.map(incomeData => {
				let income = new Income(incomeData);
				return income;
			});
	}

	saveIncome(income: Income) {
		if (income.eu_vat_type == EuVatType.None) {
			income.eu_vat_type = null;
		}

		if (income.id) {
			return this.patch(this.getRestEntityPath(this.pathIncome, income.id), income)
				.map(incomeData => {
					let income = new Income(incomeData);
					return income;
				});
		}

		return this.post(this.pathIncome, income)
			.map(incomeData => {
				let income = new Income(incomeData);
				return income;
			});
	}

	deleteIncome(income: Income): Observable<any> {
		return this.delete(this.getRestEntityPath(this.pathIncome, income.id));
	}

}

