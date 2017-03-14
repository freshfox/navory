import {Component, ElementRef} from "@angular/core";
import {ReportService} from "../../services/report.service";
import {ModalService} from "../../core/modal.module";
import {NumberPipe} from "../../core/pipes/number.pipe";
var moment = require('moment');
var Chartist = require('chartist');

@Component({
	templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

	private data;
	private loading: boolean = false;

	constructor(private reportService: ReportService, private el: ElementRef, private modalService: ModalService, private numberPipe: NumberPipe) {
	}

	ngOnInit() {
		this.loading = true;
		this.reportService.getFinanceOverview()
			.subscribe((data) => {
				this.loading = false;
				this.data = data;
				setTimeout(() => {
					this.showRevenueChart();
				}, 100);
			});
	}

	ngAfterViewInit() {
	}

	get profitInfo(): string {
		let monthIndex = new Date().getMonth();
		let month = this.data.months[monthIndex];

		if (month.revenue.totalGross > 0) {
			let formatted = this.numberPipe.transform(month.revenue.totalGross);
			return `Diesen Monat hast du € ${formatted} Gewinn gemacht.`;
		}

		month = this.data.months[monthIndex - 1];
		if (month.revenue.totalGross > 0) {
			let formatted = this.numberPipe.transform(month.revenue.totalGross);
			return `Letzten Monat hast du € ${formatted} Gewinn gemacht.`;
		}

		return null;
	}

	showRevenueChart() {
		let revenue = [];
		this.data.months.forEach((month) => {
			revenue.push(month.revenue.totalGross);
		});

		var chart = new Chartist.Line('.ct-chart', {
				labels: moment.monthsShort(),
				series: [
					revenue,
				]
			}, {
				height: '120px',
				lineSmooth: Chartist.Interpolation.none(),
				chartPadding: {
					left: 0,
					right: 0
				},
				low: 0,
				fullWidth: true,
				showArea: true,
				axisY: {
					onlyInteger: true,
					offset: 0,
					showGrid: false,
					labelInterpolationFnc: function (value) {
						return '';
					},
				},
				axisX: {
					showGrid: false
				}
			}
		);
	}

	showChart() {
		var income = [];
		var expenses = [];
		this.data.months.forEach((month) => {
			income.push(month.income.totalNet);
			expenses.push(month.expense.totalNet);
		});

		var chart = new Chartist.Line('.ct-chart', {
				labels: moment.monthsShort(),
				series: [
					income,
					expenses
				]
			}, {
				height: '240px',
				lineSmooth: Chartist.Interpolation.simple({
					divisor: 2
				}),
				chartPadding: {
					left: 40
				},
				low: 0,
				fullWidth: true,
				showArea: true,
				axisY: {
					onlyInteger: true,
					offset: 20,
					labelInterpolationFnc: function (value) {
						return '&euro;' + value;
					},
				},
				axisX: {
					showGrid: false
				}
			}
		);

		chart.on('draw', function (data) {
			if (data.type === 'line' || data.type === 'area') {

			}
		});
	}

}
