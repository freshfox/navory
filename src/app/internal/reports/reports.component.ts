import {Component, OnInit} from '@angular/core';
import {ReportService} from "../../services/report.service";
var moment = require('moment');

@Component({
    templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {

    private report;

    private loading: boolean = false;
    private selectedQuarter: number;
    private selectedYear: number;
    private quarters = [
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

    constructor(private reportService: ReportService) {
        this.selectedYear = new Date().getFullYear();
        this.selectedQuarter = moment().quarter() - 1;
    }

    ngOnInit() {
        this.refreshReport();
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
