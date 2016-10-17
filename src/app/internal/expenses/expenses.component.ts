import {Component, OnInit, SimpleChange} from '@angular/core';
import {TranslateService} from "ng2-translate";
import {TableOptions} from "../../core/components/table/table-options.model";
import {NumberPipe} from "../../core/pipes/number.pipe";
import {DatePipe} from "../../core/pipes/date.pipe";
import {SortDirection} from "../../core/components/table/sort-direction.enum";
import {Expense} from "../../models/expense";
import {ExpenseService} from "../../services/expense.service";
import * as moment from 'moment';
import {State} from "../../core/state";
import {Router} from "@angular/router";

@Component({
    templateUrl: 'expenses.component.html'
})
export class ExpensesComponent implements OnInit {

    private expenses: Expense[];
    private filteredExpenses: Expense[];
    private loading = false;
    private selectedMonthIndex: number;
    private selectedYear: number;
    private tableOptions: TableOptions;

    constructor(private expenseService: ExpenseService,
                private translate: TranslateService,
                private numberPipe: NumberPipe,
                private datePipe: DatePipe,
                private state: State,
                private router: Router) {

        this.tableOptions = new TableOptions({
            columns: [
                {name: this.translate.instant('general.number-abbrev'), prop: 'id', sortDirection: SortDirection.Asc},
                {name: this.translate.instant('general.description'), prop: 'description'},
                {name: this.translate.instant('general.date'), prop: 'date', pipe: this.datePipe},
                {name: this.translate.instant('general.category'), prop: 'category.name'},
                {name: this.translate.instant('general.amount_net'), prop: 'price', pipe: this.numberPipe},
            ]
        });

        let momentInstance = moment();
        this.selectedMonthIndex = this.state.selectedExpenseMonthIndex || momentInstance.month();
        this.selectedYear = momentInstance.year();
    }

    ngOnInit() {
        this.loading = true;
        this.expenseService.getExpenses()
            .subscribe((expenses) => {
                    this.expenses = expenses;
                    this.filter();
                    this.loading = false;
                },
                (error) => {
                    // TODO
                });
    }

    filter() {
        this.state.selectedExpenseMonthIndex = this.selectedMonthIndex;
        this.filteredExpenses = this.expenses.filter((expense) => {
            let momentInstance = moment(expense.date);
            let month = momentInstance.month();
            let year = momentInstance.year();
            return month == this.selectedMonthIndex && year == this.selectedYear;
        });
    }

    createExpense() {
        this.router.navigate(['/expenses/new']);
    }

    editExpense(expense) {
        this.router.navigate([`/expenses/${expense.id}`]);
    }

}