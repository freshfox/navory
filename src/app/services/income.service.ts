import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Income} from '../models/income';
import {ApiService} from '@freshfox/ng-core';
import {EuVatType} from '../core/enums/eu-vat-type.enum';
import {map} from 'rxjs/operators';

@Injectable()
export class IncomeService {

	private pathIncome = '/incomes';

	constructor(private apiService: ApiService) {

	}

	getIncomes(): Observable<Income[]> {
		return this.apiService.get(this.pathIncome);
	}

	getIncome(id: string): Observable<Income> {
		return this.apiService.get(this.apiService.getRestEntityPath(this.pathIncome, id))
			.pipe(map(incomeData => {
				return new Income(incomeData);
			}));
	}

	saveIncome(income: Income) {
		if (income.eu_vat_type == EuVatType.None) {
			income.eu_vat_type = null;
		}

		if (income.id) {
			return this.apiService.patch(this.apiService.getRestEntityPath(this.pathIncome, income.id), income)
				.pipe(map(incomeData => {
					return new Income(incomeData);
				}));
		}

		return this.apiService.post(this.pathIncome, income)
			.pipe(map(incomeData => {
				return new Income(incomeData);
			}));
	}

	deleteIncome(income: Income): Observable<any> {
		return this.apiService.delete(this.apiService.getRestEntityPath(this.pathIncome, income.id));
	}

}

