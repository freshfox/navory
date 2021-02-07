import {Component, OnInit} from '@angular/core';
import {ReportService} from '../../services/report.service';
var moment = require('moment');

@Component({
	templateUrl: './vat-report.component.html'
})
export class VatReportComponent implements OnInit {

	report;

	loading: boolean = false;
	quarters = [
		{
			value: 0,
			name: 'Q1'
		},
		{
			value: 1,
			name: 'Q2'
		},
		{
			value: 2,
			name: 'Q3'
		},
		{
			value: 3,
			name: 'Q4'
		}
	];

	months: string[] = [];
	timeFrameTypes = [
		TimeframeType.Quarterly,
		TimeframeType.Monthly,
	];
	timeframeTypeQuarterly = TimeframeType.Quarterly;
	timeframeTypeMonthly = TimeframeType.Monthly;

	selectedQuarter: number;
	selectedMonth: number;
	selectedYear: number;
	selectedTimeFrameType = TimeframeType.Quarterly;

	constructor(private reportService: ReportService) {
		this.selectedYear = new Date().getFullYear();
		this.selectedQuarter = moment().quarter() - 1;
		this.selectedMonth = moment().month() - 1;

		this.months = moment.months();
	}

	ngOnInit() {
		this.refreshReport();
	}

	getAbsoluteAmount(amount: number) {
		return Math.abs(amount);
	}

	refreshReport() {
		this.loading = true;

		const options = {
			year: this.selectedYear
		} as any;

		if (this.selectedTimeFrameType === TimeframeType.Monthly) {
			options.month = this.selectedMonth;
		} else {
			options.quarter = this.selectedQuarter;
		}

		this.reportService.getVatReport(options)
			.subscribe(report => {
				this.report = report;
				this.loading = false;
			});
	}
}

enum TimeframeType {
	Quarterly = 'quarterly',
	Monthly = 'monthly'
}
