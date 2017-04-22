import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {EuVatType} from "../core/enums/eu-vat-type.enum";
import {TranslateService} from "@ngx-translate/core";
import {Unit} from "../models/unit";
import {State} from "../core/state";
import {Country} from "../models/country";

@Injectable()
export class BootstrapService extends BaseService {

	private pathBootstrap = '/bootstrap';
	private defaultCountryCCA2 = 'AT';

	constructor(http: Http, private translate: TranslateService, private state: State) {
		super(http);
	}

	getBootstrapData(): Observable<any> {
		return this.get(this.pathBootstrap);
	}

	getFormattedEuVatTypes() {
		return [
			{
				name: this.translate.instant('income.edit.intra-community-none'),
				value: EuVatType.None
			},
			{
				name: this.translate.instant('income.edit.intra-community-service'),
				value: EuVatType.ReverseCharge
			},
			{
				name: this.translate.instant('income.edit.intra-community-product'),
				value: EuVatType.IntraCommunityAcquisition
			}
		];
	}

	getUnits(): Observable<Unit[]> {
		return Observable.of(this.state.units);
	}

	getCountries(): Country[] {
		return this.state.countries;
	}

	getDefaultCountry(): Country {
		var defaultCountry;
		this.getCountries().forEach(country => {
			if (country.cca2 == this.defaultCountryCCA2) {
				defaultCountry = country;
			}
		});

		return defaultCountry;
	}

}
