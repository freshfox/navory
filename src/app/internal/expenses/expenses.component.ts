import {Component, OnInit, ViewChild, TemplateRef} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {TableOptions} from "../../core/components/table/table-options.model";
import {NumberPipe} from "../../core/pipes/number.pipe";
import {DatePipe} from "../../core/pipes/date.pipe";
import {SortDirection} from "../../core/components/table/sort-direction.enum";
import {Expense} from "../../models/expense";
import {ExpenseService} from "../../services/expense.service";
import * as moment from "moment";
import {State} from "../../core/state";
import {Router} from "@angular/router";
import {ColumnAlignment} from "../../core/components/table/column-alignment.enum";
import {SubscriptionService} from "../../services/subscription.service";
import {ModalService} from "ffc-angular";

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

	@ViewChild('actionsColumn') actionsColumn: TemplateRef<any>;
	@ViewChild('attachmentColumn') attachmentColumn: TemplateRef<any>;
	@ViewChild('paidColumn') paidColumn: TemplateRef<any>;

	constructor(private expenseService: ExpenseService,
				private translate: TranslateService,
				private numberPipe: NumberPipe,
				private datePipe: DatePipe,
				private state: State,
				private router: Router,
				private modalService: ModalService,
				private subscriptionService: SubscriptionService) {
	}

	ngOnInit() {
		this.tableOptions = new TableOptions({
			columns: [
				{cellTemplate: this.attachmentColumn, width: 5, sortable: false},
				{
					name: this.translate.instant('general.number-abbrev'),
					prop: 'number',
					width: 7,
					sortDirection: SortDirection.Asc
				},
				{name: this.translate.instant('general.description'), prop: 'description'},
				{name: this.translate.instant('general.date'), prop: 'date', width: 12, pipe: this.datePipe},
				{name: this.translate.instant('general.category'), prop: 'category.name', width: 20},
				{name: this.translate.instant('general.paid'), width: 8, cellTemplate: this.paidColumn, alignment: ColumnAlignment.Center},
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
		if (this.subscriptionService.expensesEnabled()) {
			this.router.navigate(['/expenses/new']);
		} else {
			this.subscriptionService.showUpgradeModal();
		}
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
		return expense.unpaid_amount <= 0;
	}

	isPartlyPaid(expense: Expense) {
		return !this.isFullyPaid(expense) && !this.isNotPaid(expense);
	}

	isNotPaid(expense: Expense) {
		return expense.getAmountGross() === expense.unpaid_amount;
	}


	deleteExpense(expense) {
		this.modalService.createConfirmRequest(
			this.translate.instant('expenses.delete-confirm-title'),
			this.translate.instant('expenses.delete-confirm-message'),
			() => {
				this.modalService.hideCurrentModal();
			},
			() => {
				let index = this.expenses.indexOf(expense);
				this.expenses.splice(index, 1);
				this.filter();
				this.expenseService.deleteExpense(expense).subscribe();
				this.modalService.hideCurrentModal();
			});
	}

}
