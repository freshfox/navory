import {Component, OnInit, SimpleChange} from '@angular/core';
import {ReportService} from "../../services/report.service";

@Component({
    templateUrl: 'reports.component.html'
})
export class ReportsComponent implements OnInit {

    private report;
    private selectedQuarter: number = 1;
    private selectedYear: number;
    private quarters = [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 }
    ];

    constructor(private reportService: ReportService) {
        this.selectedYear = new Date().getFullYear();
    }

    ngOnInit() {
        this.refreshReport();
    }

    refreshReport() {
        this.reportService.getVatReport(this.selectedQuarter, this.selectedYear)
            .subscribe(report => this.report = report);
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        for (let propName in changes) {
            if (propName === 'selectedQuarter') {
                this.refreshReport();
            }
        }
    }

}
