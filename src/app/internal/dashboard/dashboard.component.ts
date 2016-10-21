import {Component, ElementRef} from '@angular/core';
import {ReportService} from "../../services/report.service";
var moment = require('moment');
import * as Chartist from 'chartist';

@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {

    private data;
    private loading: boolean = false;

    constructor(private reportService: ReportService, private el: ElementRef) {

    }

    ngAfterViewInit() {
        this.loading = true;
        this.reportService.getFinanceOverview()
            .subscribe((data) => {
                this.loading = false;
                this.data = data;
                this.showChart();
            });
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
                    labelInterpolationFnc: function(value) {
                        return '&euro;' + value;
                    },
                },
                axisX: {
                    showGrid: false
                }
            }
        );

        chart.on('draw', function(data) {
            if (data.type === 'line' || data.type === 'area') {

            }
        });
    }

}
