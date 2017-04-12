import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
const moment = require('moment');

@Injectable()
export class ReportService extends BaseService {

	private pathVatReport = '/reports/vat';
	private pathFinance = '/finance';

	constructor(http: Http) {
		super(http);
	}

	getVatReport(quarter: number, year: number = new Date().getFullYear()): Observable<any> {
		let path = `${this.pathVatReport}/?quarter=${quarter}&year=${year}`;

		return this.get(path);
	}

	getFinanceOverview(year: number): Observable<any> {
		let yearDate = new Date();
		yearDate.setFullYear(year);
		let start = moment(yearDate).startOf('year').format('YYYY-MM-DD');
		let end = moment(yearDate).endOf('year').format('YYYY-MM-DD');

		let path = `${this.pathFinance}?start=${start}&end=${end}`;

		return this.get(path);
	}

}
