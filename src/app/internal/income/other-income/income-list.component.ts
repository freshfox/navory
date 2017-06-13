import {Component, OnInit, ViewChild, TemplateRef} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {TableOptions} from "../../../core/components/table/table-options.model";
import {IncomeService} from "../../../services/income.service";
import {Income} from "../../../models/income";
import {DatePipe} from "../../../core/pipes/date.pipe";
import {SortDirection} from "../../../core/components/table/sort-direction.enum";
import {ColumnAlignment} from "../../../core/components/table/column-alignment.enum";
import * as moment from "moment";
import {State} from "../../../core/state";
import {Router} from "@angular/router";
import {SubscriptionService} from "../../../services/subscription.service";
import {NumberPipe} from "../../../core/ffc-angular/pipes/number.pipe";
import {ModalService} from "../../../core/ffc-angular/services/modal.service";

@Component({
	templateUrl: './income-list.component.html'
})
export class IncomeListComponent implements OnInit {

	incomes: Income[];
	filteredIncomes: Income[];

	loading = false;
	selectedMonthIndex: number;
	selectedYear: number;
	tableOptions: TableOptions;

	@ViewChild('actionsColumn') actionsColumn: TemplateRef<any>;
	@ViewChild('attachmentColumn') attachmentColumn: TemplateRef<any>;

	constructor(private incomeService: IncomeService,
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
				{name: this.translate.instant('general.date'), prop: 'date', pipe: this.datePipe, width: 12},
				{
					name: this.translate.instant('general.amount_net'),
					prop: 'price',
					pipe: this.numberPipe,
					width: 10,
					alignment: ColumnAlignment.Right
				},
				{cellTemplate: this.actionsColumn, width: 4, sortable: false},
			]
		});

		let momentInstance = moment();
		this.selectedMonthIndex = this.state.selectedIncomeMonthIndex !== undefined ? this.state.selectedIncomeMonthIndex : momentInstance.month();
		this.selectedYear = this.state.selectedIncomeYear !== undefined ? this.state.selectedIncomeYear : momentInstance.year();

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
		this.state.selectedIncomeYear = this.selectedYear;
		this.filteredIncomes = this.incomes.filter((income) => {
			let momentInstance = moment(income.date);
			let month = momentInstance.month();
			let year = momentInstance.year();
			return month == this.selectedMonthIndex && year == this.selectedYear;
		});
	}

	createIncome() {
		if (this.subscriptionService.incomeEnabled()) {
			this.router.navigate(['/income/new']);
		} else {
			this.subscriptionService.showUpgradeModal();
		}
	}

	editIncome(income: Income) {
		this.router.navigate([`/income/${income.id}`]);
	}

	copyIncome(income: Income) {
		this.router.navigate([`/income/new`], {
			queryParams: {copy: income.id}
		});
	}

	deleteIncome(income: Income) {
		this.modalService.createConfirmRequest(
			this.translate.instant('income.delete-confirm-title'),
			this.translate.instant('income.delete-confirm-message'),
			() => {
				this.modalService.hideCurrentModal();
			},
			() => {
				let index = this.incomes.indexOf(income);
				this.incomes.splice(index, 1);
				this.filter();
				this.incomeService.deleteIncome(income).subscribe();
				this.modalService.hideCurrentModal();
			});
	}

}
