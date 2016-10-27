import {Component, OnInit} from '@angular/core';
import {TranslateService} from "ng2-translate";
import {TableOptions} from "../../../core/components/table/table-options.model";
import {IncomeService} from "../../../services/income.service";
import {Income} from "../../../models/income";
import {NumberPipe} from "../../../core/pipes/number.pipe";
import {DatePipe} from "../../../core/pipes/date.pipe";
import {SortDirection} from "../../../core/components/table/sort-direction.enum";
import {ColumnAlignment} from "../../../core/components/table/column-alignment.enum";
import * as moment from "moment";
import {State} from "../../../core/state";
import {Router} from "@angular/router";

@Component({
    templateUrl: 'income-list.component.html'
})
export class IncomeListComponent implements OnInit {

    private incomes: Income[];
    private filteredIncomes: Income[];

    private loading = false;
    private selectedMonthIndex: number;
    private selectedYear: number;
    private tableOptions: TableOptions;


    constructor(private incomeService: IncomeService,
                private translate: TranslateService,
                private numberPipe: NumberPipe,
                private datePipe: DatePipe,
                private state: State,
                private router: Router) {

        this.tableOptions = new TableOptions({
            columns: [
                { name: this.translate.instant('general.number-abbrev'),  prop: 'number', width: 7, sortDirection: SortDirection.Asc },
                { name: this.translate.instant('general.description'),  prop: 'description' },
                { name: this.translate.instant('general.date'),  prop: 'date', pipe: this.datePipe, width: 12 },
                { name: this.translate.instant('general.amount_net'),  prop: 'price', pipe: this.numberPipe, width: 10, alignment: ColumnAlignment.Right },
            ]
        });

        let momentInstance = moment();
        this.selectedMonthIndex = this.state.selectedIncomeMonthIndex || momentInstance.month();
        this.selectedYear = momentInstance.year();
    }

    ngOnInit() {
        this.loading = true;
        this.incomeService.getIncomes()
            .subscribe((incomes) => {
                    this.incomes = incomes;
                    this.loading = false;
                    this.filter();
                },
                (error) => {
                    // TODO
                });
    }

    filter() {
        this.state.selectedIncomeMonthIndex = this.selectedMonthIndex;
        this.filteredIncomes = this.incomes.filter((income) => {
            let momentInstance = moment(income.date);
            let month = momentInstance.month();
            let year = momentInstance.year();
            return month == this.selectedMonthIndex && year == this.selectedYear;
        });
    }

    createIncome() {
        this.router.navigate(['/income/new']);
    }

    editIncome(income: Income) {
        this.router.navigate([`/income/${income.id}`]);
    }

}
