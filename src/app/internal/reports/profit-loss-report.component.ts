import {Component, OnInit} from '@angular/core';
import {SubscriptionService} from "../../services/subscription.service";
import * as moment from 'moment';

@Component({
	moduleId: module.id,
	selector: 'nvry-profit-loss-report',
	templateUrl: 'profit-loss-report.component.html'
})
export class ProfitLossReportComponent implements OnInit {

	startDate: Date;
	endDate: Date;
	reportsEnabled: boolean;

	constructor(private subscriptionService: SubscriptionService) {
	}

	ngOnInit() {
			this.startDate = moment().startOf('year').toDate();
			this.endDate = moment().endOf('year').toDate();

		this.reportsEnabled = this.subscriptionService.reportsEnabled();
	}

	get reportUrl(): string {
		return 'http://localhost:3000/invoices/129/html';
	}
}
