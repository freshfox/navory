import {ApiService} from '@freshfox/ng-core';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Config} from '../core/config';
import moment from 'moment';
import {FileService} from './file.service';
import {DateFormatter} from '../core/date-formatter';

@Injectable()
export class ReportService {

	private pathVatReport = '/reports/vat';
	private pathFinance = '/finance';

	constructor(private apiService: ApiService, private fileService: FileService) {

	}

	getVatReport(options: { month?: number, quarter?: number, year: number }): Observable<any> {
		return this.apiService.get(this.pathVatReport, options);
	}

	getFinanceOverview(year: number): Observable<any> {
		let yearDate = new Date();
		yearDate.setFullYear(year);
		let start = moment(yearDate).startOf('year').format(Config.apiDateFormat);
		let end = moment(yearDate).endOf('year').format(Config.apiDateFormat);

		let path = `${this.pathFinance}?start=${start}&end=${end}`;

		return this.apiService.get(path);
	}

	getProfitLossReportUrl(startDate: Date, endDate: Date): string {
		let start = DateFormatter.formatDateForApi(startDate);
		let end = DateFormatter.formatDateForApi(endDate);

		return this.apiService.constructApiUrl(`/reports/profit-loss?start=${start}&end=${end}`);
	}

	downloadProfitLossReport(startDate: Date, endDate: Date) {
		let start = DateFormatter.formatDateForApi(startDate);
		let end = DateFormatter.formatDateForApi(endDate);

		let url = this.apiService.constructApiUrl(`/reports/profit-loss/pdf?start=${start}&end=${end}`);
		this.fileService.downloadFromURL(url);
	}
}
