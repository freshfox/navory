import {Component, OnInit} from '@angular/core';
import {TranslateService} from "ng2-translate";
import {TableOptions} from "../../core/components/table/table-options.model";
import {IncomeService} from "../../services/income.service";
import {Income} from "../../models/income";
import {NumberPipe} from "../../core/pipes/number.pipe";
import {DatePipe} from "../../core/pipes/date.pipe";
import {SortDirection} from "../../core/components/table/sort-direction.enum";

@Component({
    templateUrl: 'income.component.html'
})
export class IncomeComponent implements OnInit {

    private incomes: Income[];
    private loading = false;

    tableOptions: TableOptions;

    constructor(private incomeService: IncomeService, private translate: TranslateService, private numberPipe: NumberPipe, private datePipe: DatePipe) {

        this.tableOptions = new TableOptions({
            columns: [
                { name: this.translate.instant('general.number-abbrev'),  prop: 'id', sortDirection: SortDirection.Asc },
                { name: this.translate.instant('general.description'),  prop: 'description' },
                { name: this.translate.instant('general.date'),  prop: 'date', pipe: this.datePipe },
                { name: this.translate.instant('general.amount_net'),  prop: 'price', pipe: this.numberPipe},
            ]
        });
    }

    ngOnInit() {
        this.loading = true;
        this.incomeService.getIncomes()
            .subscribe((incomes) => {
                    this.incomes = incomes;
                    this.loading = false;
                },
                (error) => {
                    // TODO
                });
    }

    createIncome() {
        // TODO
    }

    editIncome(income) {
        // TODO
    }

}
