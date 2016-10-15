import {Component, OnInit} from '@angular/core';
import {TranslateService} from "ng2-translate";
import {TableOptions} from "../../core/components/table/table-options.model";
import {NumberPipe} from "../../core/pipes/number.pipe";
import {DatePipe} from "../../core/pipes/date.pipe";
import {SortDirection} from "../../core/components/table/sort-direction.enum";
import {Expense} from "../../models/expense";
import {ExpenseService} from "../../services/expense.service";

@Component({
    templateUrl: 'expenses.component.html'
})
export class ExpensesComponent implements OnInit {

    private expenses: Expense[];
    private loading = false;

    tableOptions: TableOptions;

    constructor(private expenseService: ExpenseService, private translate: TranslateService, private numberPipe: NumberPipe, private datePipe: DatePipe) {

        this.tableOptions = new TableOptions({
            columns: [
                { name: this.translate.instant('general.number-abbrev'),  prop: 'id', sortDirection: SortDirection.Asc },
                { name: this.translate.instant('general.description'),  prop: 'description' },
                { name: this.translate.instant('general.date'),  prop: 'date', pipe: this.datePipe },
                { name: this.translate.instant('general.category'),  prop: 'category.name' },
                { name: this.translate.instant('general.amount_net'),  prop: 'price', pipe: this.numberPipe},
            ]
        });
    }

    ngOnInit() {
        this.loading = true;
        this.expenseService.getIncomes()
            .subscribe((expenses) => {
                    this.expenses = expenses;
                    this.loading = false;
                },
                (error) => {
                    // TODO
                });
    }

    createExpense() {
        // TODO
    }

    editExpense(expense) {
        // TODO
    }

}
