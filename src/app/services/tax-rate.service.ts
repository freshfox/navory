import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {TaxRate} from "../models/tax-rate";
import {State} from "../core/state";
import {Observable} from "rxjs";

@Injectable()
export class TaxRateService extends BaseService {

    private defaultTaxRate = 20;

    constructor(http: Http, private state: State) {
        super(http);
    }

    getTaxRate(id: number): Observable<TaxRate> {
        let rates = this.state.taxRates;
        var rate = null;
        rates.forEach(currentRate => {
           if(currentRate.id == id) {
               rate = currentRate;
           }
        });

        return Observable.of(rate);
    }

    getTaxRates(): Observable<TaxRate[]> {
        return Observable.of(this.state.taxRates);
    }

    getDefaultTaxRate(): Observable<TaxRate> {
        var defaultRate;
        this.state.taxRates.forEach(rate => {
           if(rate.rate == this.defaultTaxRate) {
               defaultRate = rate;
           }
        });

        return Observable.of(defaultRate);
    }

}
