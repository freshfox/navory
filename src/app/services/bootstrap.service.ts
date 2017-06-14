import {NavoryApi} from "./base.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {EuVatType} from "../core/enums/eu-vat-type.enum";
import {TranslateService} from "@ngx-translate/core";
import {Unit} from "../models/unit";
import {State} from "../core/state";
import {Country} from "../models/country";

@Injectable()
export class BootstrapService extends NavoryApi {

	private pathBootstrap = '/bootstrap';

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
		return this.getCountryByCode(this.state.user.account.country_code);
	}

	getAustria(): Country {
		return this.getCountryByCode('AUT');
	}

	getCountryByCode(code: string) {
		return this.getCountries().find(country => {
			return country.code === code
		});
	}

}
