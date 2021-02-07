import {Component, OnInit} from "@angular/core";
import moment from "moment";
import {ReportService} from "../../services/report.service";

@Component({
	moduleId: module.id,
	selector: 'nvry-profit-loss-report',
	templateUrl: 'profit-loss-report.component.html'
})
export class ProfitLossReportComponent implements OnInit {

	startDate: any;
	endDate: any;

	constructor(private reportService: ReportService) {
	}

	ngOnInit() {
		setTimeout(() => {
			this.startDate = moment().startOf('year').toDate();
			this.endDate = moment().endOf('year').toDate();
		}, 1);
	}

	get reportUrl(): string {
		return this.reportService.getProfitLossReportUrl(this.startDate, this.endDate);
	}

	downloadReport() {
		this.reportService.downloadProfitLossReport(this.startDate, this.endDate);
	}
}
