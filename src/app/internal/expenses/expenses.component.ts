import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '../../core/pipes/date.pipe';
import {Expense} from '../../models/expense';
import {ExpenseService} from '../../services/expense.service';
import moment from 'moment';
import {State} from '../../core/state';
import {Router} from '@angular/router';
import {NumberPipe} from '../../lib/ffc-angular/pipes/number.pipe';
import {ColumnAlignment, DialogService, DialogType, SortDirection, TableOptions} from '@freshfox/ng-core';

@Component({
	templateUrl: './expenses.component.html'
})
export class ExpensesComponent implements OnInit {

	expenses: Expense[];
	filteredExpenses: Expense[];
	loading = false;
	selectedMonthIndex: number;
	selectedYear: number;
	tableOptions: TableOptions;

	@ViewChild('actionsColumn', { static: true }) actionsColumn: TemplateRef<any>;
	@ViewChild('attachmentColumn', { static: true }) attachmentColumn: TemplateRef<any>;
	@ViewChild('paidColumn', { static: true }) paidColumn: TemplateRef<any>;

	constructor(private expenseService: ExpenseService,
				private translate: TranslateService,
				private numberPipe: NumberPipe,
				private datePipe: DatePipe,
				private state: State,
				private router: Router,
				private dialogService: DialogService) {
	}

	ngOnInit() {
		this.tableOptions = new TableOptions({
			columns: [
				{cellTemplate: this.attachmentColumn, width: 5, sortable: false},
				{
					name: this.translate.instant('general.number-abbrev'),
					prop: 'number',
					width: 7,
				},
				{name: this.translate.instant('general.description'), prop: 'description'},
				{
					name: this.translate.instant('general.date'),
					prop: 'date',
					width: 12,
					pipe: this.datePipe,
					sortDirection: SortDirection.Asc
				},
				{name: this.translate.instant('general.category'), prop: 'category.name', width: 20},
				{
					name: this.translate.instant('general.paid'),
					width: 8,
					cellTemplate: this.paidColumn,
					alignment: ColumnAlignment.Center
				},
				{
					name: this.translate.instant('general.amount_net'),
					prop: 'price',
					width: 10,
					pipe: this.numberPipe,
					alignment: ColumnAlignment.Right
				},
				{width: 4, cellTemplate: this.actionsColumn, sortable: false},
			]
		});

		let momentInstance = moment();
		this.selectedMonthIndex = this.state.selectedExpenseMonthIndex !== undefined ? this.state.selectedExpenseMonthIndex : momentInstance.month();
		this.selectedYear = this.state.selectedExpenseYear !== undefined ? this.state.selectedExpenseYear : momentInstance.year();

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
		this.state.selectedExpenseYear = this.selectedYear;
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

	copyExpense(expense: Expense) {
		this.router.navigate([`/expenses/new`], {
			queryParams: {copy: expense.id}
		});
	}


	isFullyPaid(expense: Expense) {
		return expense.unpaid_amount <= 0 && expense.getAmountGross() > 0;
	}

	isPartlyPaid(expense: Expense) {
		return !this.isFullyPaid(expense) && !this.isNotPaid(expense);
	}

	isNotPaid(expense: Expense) {
		return expense.getAmountGross() === expense.unpaid_amount;
	}


	deleteExpense(expense) {
		this.dialogService.createConfirmRequest(
			this.translate.instant('expenses.delete-confirm-title'),
			this.translate.instant('expenses.delete-confirm-message'),
			null,
			null,
			DialogType.Danger
		).subscribe(confirmed => {
			if (confirmed) {
				let index = this.expenses.indexOf(expense);
				this.expenses.splice(index, 1);
				this.filter();
				this.expenseService.deleteExpense(expense).subscribe();
			}
		});
	}

}
