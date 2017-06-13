import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Config} from "../core/config";
import {Formatter123} from "../core/formatter";
import * as moment from 'moment';
import {FileService} from "./file.service";

@Injectable()
export class ReportService extends BaseService {

	private pathVatReport = '/reports/vat';
	private pathFinance = '/finance';

	constructor(http: Http, private formatter: Formatter123, private fileService: FileService) {
		super(http);
	}

	getVatReport(quarter: number, year: number = new Date().getFullYear()): Observable<any> {
		let path = `${this.pathVatReport}/?quarter=${quarter}&year=${year}`;

		return this.get(path);
	}

	getFinanceOverview(year: number): Observable<any> {
		let yearDate = new Date();
		yearDate.setFullYear(year);
		let start = moment(yearDate).startOf('year').format(Config.apiDateFormat);
		let end = moment(yearDate).endOf('year').format(Config.apiDateFormat);

		let path = `${this.pathFinance}?start=${start}&end=${end}`;

		return this.get(path);
	}

	getProfitLossReportUrl(startDate: Date, endDate: Date): string {
		let start = this.formatter.formatDateForApi(startDate);
		let end = this.formatter.formatDateForApi(endDate);

		return this.constructApiUrl(`/reports/profit-loss?start=${start}&end=${end}`);
	}

	downloadProfitLossReport(startDate: Date, endDate: Date) {
		let start = this.formatter.formatDateForApi(startDate);
		let end = this.formatter.formatDateForApi(endDate);

		let url = this.constructApiUrl(`/reports/profit-loss/pdf?start=${start}&end=${end}`);
		this.fileService.downloadFromURL(url);
	}
}
