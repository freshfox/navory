import {NavoryApi} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Income} from "../models/income";
import {Http} from "@angular/http";
import {EuVatType} from "../core/enums/eu-vat-type.enum";
import {AnalyticsEventType, AnalyticsService} from "./analytics.service";
import {map} from 'rxjs/operators';

@Injectable()
export class IncomeService extends NavoryApi {

	private pathIncome = '/incomes';

	constructor(http: Http, private analytics: AnalyticsService) {
		super(http);
	}

	getIncomes(): Observable<Income[]> {
		return this.get(this.pathIncome);
	}

	getIncome(id: string): Observable<Income> {
		return this.get(this.getRestEntityPath(this.pathIncome, id))
			.pipe(map(incomeData => {
				return new Income(incomeData);
			}));
	}

	saveIncome(income: Income) {
		if (income.eu_vat_type == EuVatType.None) {
			income.eu_vat_type = null;
		}

		if (income.id) {
			return this.patch(this.getRestEntityPath(this.pathIncome, income.id), income)
				.pipe(map(incomeData => {
					this.analytics.trackEvent(AnalyticsEventType.IncomeUpdate);
					return new Income(incomeData);
				}));
		}

		return this.post(this.pathIncome, income)
			.pipe(map(incomeData => {
				this.analytics.trackEvent(AnalyticsEventType.IncomeCreate);
				return new Income(incomeData);
			}));
	}

	deleteIncome(income: Income): Observable<any> {
		this.analytics.trackEvent(AnalyticsEventType.IncomeDelete);
		return this.delete(this.getRestEntityPath(this.pathIncome, income.id));
	}

}

