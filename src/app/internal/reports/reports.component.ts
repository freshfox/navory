import {Component, OnInit, SimpleChange} from '@angular/core';
import {ReportService} from "../../services/report.service";

@Component({
    templateUrl: 'reports.component.html'
})
export class ReportsComponent implements OnInit {

    private report;
    private selectedQuarter = 1;
    private quarters = [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 }
    ];
    
    constructor(private reportService: ReportService) { }

    ngOnInit() {
        this.refreshReport();
    }

    refreshReport() {
        this.reportService.getVatReport(this.selectedQuarter)
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
