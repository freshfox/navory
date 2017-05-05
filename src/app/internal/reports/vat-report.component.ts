import {Component, OnInit} from "@angular/core";
import {ReportService} from "../../services/report.service";
import {SubscriptionService} from "../../services/subscription.service";
var moment = require('moment');

@Component({
	templateUrl: './vat-report.component.html'
})
export class VatReportComponent implements OnInit {

	report;

	loading: boolean = false;
	selectedQuarter: number;
	selectedYear: number;
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

	reportsEnabled: boolean;

	constructor(private reportService: ReportService, private subscriptionService: SubscriptionService) {
		this.selectedYear = new Date().getFullYear();
		this.selectedQuarter = moment().quarter() - 1;
	}

	ngOnInit() {
		this.reportsEnabled = this.subscriptionService.reportsEnabled();

		if(this.reportsEnabled) {
			this.refreshReport();
		}
	}

	getAbsoluteAmount(amount: number) {
		return Math.abs(amount);
	}

	refreshReport() {
		this.loading = true;
		this.reportService.getVatReport(this.selectedQuarter, this.selectedYear)
			.subscribe(report => {
				this.report = report;
				this.loading = false;
			});
	}
}
