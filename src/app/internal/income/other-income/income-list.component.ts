import {Component, OnInit, ViewChild, TemplateRef} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {IncomeService} from "../../../services/income.service";
import {Income} from "../../../models/income";
import {DatePipe} from "../../../core/pipes/date.pipe";
import moment from "moment";
import {State} from "../../../core/state";
import {Router} from "@angular/router";
import {NumberPipe} from "../../../lib/ffc-angular/pipes/number.pipe";
import {TableOptions} from '../../../lib/ffc-angular/components/table/table-options.model';
import {SortDirection} from '../../../lib/ffc-angular/components/table/sort-direction.enum';
import {ColumnAlignment} from '../../../lib/ffc-angular/components/table/column-alignment.enum';
import {DialogService, DialogType} from '@freshfox/ng-core';

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

	@ViewChild('actionsColumn', { static: true }) actionsColumn: TemplateRef<any>;
	@ViewChild('attachmentColumn', { static: true }) attachmentColumn: TemplateRef<any>;

	constructor(private incomeService: IncomeService,
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
		this.router.navigate(['/income/other/new']);
	}

	editIncome(income: Income) {
		this.router.navigate([`/income/other/${income.id}`]);
	}

	copyIncome(income: Income) {
		this.router.navigate([`/income/other/new`], {
			queryParams: {copy: income.id}
		});
	}

	deleteIncome(income: Income) {
		this.dialogService.createConfirmRequest(
			this.translate.instant('income.delete-confirm-title'),
			this.translate.instant('income.delete-confirm-message'),
			null,
			null,
			DialogType.Danger
		).subscribe(confirmed => {
			if (confirmed) {
				let index = this.incomes.indexOf(income);
				this.incomes.splice(index, 1);
				this.filter();
				this.incomeService.deleteIncome(income).subscribe();
			}
		});
	}

}
