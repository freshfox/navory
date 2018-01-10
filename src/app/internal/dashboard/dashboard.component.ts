import {AfterViewInit, Component} from "@angular/core";
import {ReportService} from "../../services/report.service";
import {NumberPipe} from "../../lib/ffc-angular/ff-core.module";
let moment = require('moment');
let Chartist = require('chartist');

@Component({
	templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit {

	year: number;
	data;
	loading: boolean = false;

	private revenueChart: any;

	constructor(private reportService: ReportService, private numberPipe: NumberPipe) {
	}

	ngOnInit() {
		this.year = new Date().getFullYear();
	}

	ngAfterViewInit() {
		this.loading = true;
		this.updateData();
	}

	yearChanged() {
		this.updateData();
	}

	updateData() {
		this.reportService.getFinanceOverview(this.year)
			.subscribe((data) => {
				this.loading = false;
				this.data = data;
				setTimeout(() => {
					this.showRevenueChart();
					this.showIncomeExpenseChart();
				}, 100);
			});
	}

	get profitInfo(): string {
		let monthIndex = new Date().getMonth();
		let month = this.data.months[monthIndex];

		let formatted = this.numberPipe.transform(month.revenue.totalNet);
		if (month.revenue.totalNet > 0) {
			if (this.isCurrentYearSelected()) {
				return `Diesen Monat hast du € ${formatted} Gewinn gemacht.`;
			}
		}

		if (monthIndex > 0) {
			month = this.data.months[monthIndex - 1];
			formatted = this.numberPipe.transform(month.revenue.totalNet);
			if (month.revenue.totalNet > 0) {
				if (this.isCurrentYearSelected()) {
					return `Letzten Monat hast du € ${formatted} Gewinn gemacht.`;
				}
			}
		}

		let monthName = moment().format('MMMM');
		return `Im ${monthName} ${this.year} hast du € ${formatted} Gewinn gemacht.`;
	}

	isCurrentYearSelected() {
		return this.year === new Date().getFullYear();
	}

	showRevenueChart() {
		let revenue = [];
		this.data.months.forEach((month) => {
			revenue.push(month.revenue.accumulatedTotalGross);
		});

		let chartData = {
			labels: moment.monthsShort(),
			series: [
				revenue,
			]
		};

		if (!this.revenueChart) {
			this.revenueChart = new Chartist.Line('.revenue-chart', chartData, {
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

			this.revenueChart.on('draw', function (data) {
				let duration = 250;
				if(data.type === 'line' || data.type === 'area') {
					data.element.animate({
						d: {
							begin: 0,
							dur: 5000,
							to: data.path.clone().stringify(),
							easing: Chartist.Svg.Easing.easeOutQuint
						}
					});
				}
			});
		}

		this.revenueChart.update(chartData);

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
			let durations = 500;
			if (data.type === 'bar') {
				data.element.animate({
					y2: {
						begin: 0,
						dur: durations,
						from: data.y1,
						to: data.y2,
						easing: 'easeOutQuart'
					},

				});
			}
		});
	}

}
