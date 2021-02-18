import {AfterViewInit, ChangeDetectionStrategy, Component, HostBinding} from '@angular/core';
import {ReportService} from '../../services/report.service';
import {NumberPipe} from '../../lib/ffc-angular/ff-core.module';

let moment = require('moment');
let Chartist = require('chartist');

@Component({
	selector: 'nvry-dashboard',
	template: `
		<div class="nvry-container pt-6">
			<ff-spinner *ngIf="loading"></ff-spinner>

			<div *ngIf="data" class="space-y-8">
				<div>
					<div class="flex items-center">
						<h2 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
							Gewinn/Verlust <span class="text-gray-400">({{'general.net' | translate}})</span>
						</h2>

						<nvry-year-selection [(year)]="year" (yearChange)="yearChanged()" class="ml-4"></nvry-year-selection>
					</div>

					<div class="">
						<dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
							<div class="overflow-hidden border border-gray-200 rounded-lg dark:shadow-none dark:border-gray-500">
								<div class="px-4 py-5 sm:p-5">
									<dt class="text-sm font-medium text-gray-500 truncate dark:text-gray-200">
										Gewinn/Verlust
									</dt>
									<dd class="mt-1 text-3xl font-semibold">
										<span [class.text-red-500]="data.revenue.totalNet < 0">{{ data.revenue.totalNet | currency }}</span>
										<span class="block font-normal text-gray-400" *ngIf="profitInfo" style="font-size: 11px;">{{ profitInfo }}</span>
									</dd>
								</div>
							</div>

							<div class="overflow-hidden border border-gray-200 rounded-lg dark:shadow-none dark:border-gray-500">
								<div class="px-4 py-5 sm:p-5">
									<dt class="text-sm font-medium text-green-500 truncate dark:text-green-400">
										Einnahmen
									</dt>
									<dd class="mt-1 text-3xl font-semibold">
										{{ data.income.totalNet | currency }}
									</dd>
								</div>
							</div>

							<div class="overflow-hidden border border-gray-200 rounded-lg dark:shadow-none dark:border-gray-500">
								<div class="px-4 py-5 sm:p-5">
									<dt class="text-sm font-medium text-red-500 truncate">
										Ausgaben
									</dt>
									<dd class="mt-1 text-3xl font-semibold">
										{{ data.expense.totalNet | currency }}
									</dd>
								</div>
							</div>
						</dl>
					</div>
				</div>

				<div>
					<h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
						Rechnungen <span class="text-gray-400">(brutto)</span>
					</h3>
					<dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
						<div class="overflow-hidden border border-gray-200 rounded-lg dark:shadow-none dark:border-gray-500">
							<div class="px-4 py-5 sm:p-5">
								<dt class="text-sm font-medium text-purple-500 dark:text-purple-400 truncate">
									{{ 'invoices.open' | translate }}
								</dt>
								<dd class="mt-1 text-3xl font-semibold">
									{{ data.invoice_amounts.issued | currency }}
								</dd>
							</div>
						</div>

						<div class="overflow-hidden border border-gray-200 rounded-lg dark:shadow-none dark:border-gray-500">
							<div class="px-4 py-5 sm:p-6">
								<dt class="text-sm font-medium text-red-500 truncate">
									{{ 'general.overdue' | translate }}
								</dt>
								<dd class="mt-1 text-3xl font-semibold">
									{{ data.invoice_amounts.overdue | currency }}
								</dd>
							</div>
						</div>

						<div class="overflow-hidden border border-gray-200 rounded-lg dark:shadow-none dark:border-gray-500">
							<div class="px-4 py-5 sm:p-5">
								<dt class="text-sm font-medium text-gray-500 dark:text-gray-200 truncate">
									{{ 'general.draft' | translate }}
								</dt>
								<dd class="mt-1 text-3xl font-semibold">
									{{ data.invoice_amounts.draft | currency }}
								</dd>
							</div>
						</div>
					</dl>
				</div>

				<div>
					<div class="income-expense-chart"></div>
				</div>
			</div>
		</div>
	`
})
export class DashboardComponent implements AfterViewInit {

	@HostBinding('class') clazz = 'nvry-dashboard';

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
		if (this.isCurrentYearSelected()) {
			if (month.revenue.totalNet >= 0) {
				return `Diesen Monat hast du € ${formatted} Gewinn gemacht.`;
			} else {
				return `Diesen Monat hast du € ${formatted} Verlust gemacht.`
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
