import {Injectable} from '@angular/core';
import {ApiService} from '@freshfox/ng-core';
import {TaxRate} from '../models/tax-rate';
import {State} from '../core/state';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class TaxRateService {

	private defaultTaxRate = 20;

	constructor(private apiService: ApiService, private state: State) {

	}

	getTaxRate(id: number): Observable<TaxRate> {
		let rates = this.state.taxRates;
		var rate = null;
		rates.forEach(currentRate => {
			if (currentRate.id == id) {
				rate = currentRate;
			}
		});

		return of(rate);
	}

	getTaxRates(): Observable<TaxRate[]> {
		return of(this.state.taxRates);
	}

	getDefaultTaxRate(): Observable<TaxRate> {
		var defaultRate;
		this.state.taxRates.forEach(rate => {
			if (rate.rate == this.defaultTaxRate) {
				defaultRate = rate;
			}
		});

		return of(defaultRate);
	}

	getFormattedTaxRates() {
		return this.getTaxRates()
			.pipe(map(taxRates => {
				return taxRates.map((taxRate) => {
					taxRate['name'] = taxRate.rate + '%';
					return taxRate;
				});
			}));
	}

}
