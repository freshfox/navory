import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class ReportService extends BaseService {

    private pathVatReport = '/reports/vat';
    private pathFinance = '/finance';

    constructor(http: Http) {
        super(http);
    }

    getVatReport(quarter: number, year: number = new Date().getFullYear()) {
        let path = `${this.pathVatReport}/?quarter=${quarter}&year=${year}`;

        return this.get(path);
    }

    getFinanceOverview() {
        return this.get(this.pathFinance);
    }

}
