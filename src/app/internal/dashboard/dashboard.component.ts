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

	private year: string;
	data;
	loading: boolean = false;

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
					this.showIncomeExpenseChart();
				}, 100);
			});

		this.year = '' + new Date().getFullYear();
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
			revenue.push(month.revenue.accumulatedTotalGross);
		});

		var chart = new Chartist.Line('.revenue-chart', {
				labels: moment.monthsShort(),
				series: [
					revenue,
				]
			}, {
				seriesBarDistance: 0,
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

	showIncomeExpenseChart() {
		let income = [];
		let expenses = [];
		this.data.months.forEach((month) => {
			income.push(month.income.totalNet);
			expenses.push(month.expense.totalNet * -1);
		});

		var chart = new Chartist.Bar('.income-expense-chart', {
				labels: moment.monthsShort(),
				series: [
					income,
					expenses
				]
			}, {
				seriesBarDistance: 0,
				height: '240px',
				lineSmooth: Chartist.Interpolation.simple({
					divisor: 2
				}),
				chartPadding: {
					left: 20
				},
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
