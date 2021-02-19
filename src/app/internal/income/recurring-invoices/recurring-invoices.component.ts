import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {RecurringInvoice} from '../../../models/invoice';
import {InvoiceService} from '../../../services/invoice.service';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '../../../core/pipes/date.pipe';
import {Router} from '@angular/router';
import {NumberPipe} from '../../../lib/ffc-angular/pipes/number.pipe';
import {LineUtils} from '../../../utils/line-utils';
import {ColumnAlignment, DialogService, DialogType, TableOptions} from '@freshfox/ng-core';

@Component({
	selector: 'nvry-recurring-invoices',
	template: `
		<div class="page-header">
			<button ff-button icon="plus" class="create-button" (click)="createInvoice()">
				{{ 'recurring-invoices.new' | translate }}
			</button>
		</div>

		<ff-table [options]="tableOptions" [loading]="loading" [rows]="invoices" (onRowClicked)="editInvoice($event)"
				  class="invoice-list-table">

			<div empty class="empty-view">
				<p class="title" [innerHTML]="'recurring-invoices.empty-state-message' | translate"></p>
				<button ff-button icon="plus" class="create-button" (click)="createInvoice()">
					{{ 'recurring-invoices.new' | translate }}
				</button>
			</div>

		</ff-table>

		<ng-template #actionsColumn let-row="row" let-value="value">
			<ff-dropdown>
				<button (click)="editInvoice(row)">{{ 'actions.view' | translate }}</button>
				<button (click)="deleteInvoice(row)">{{ 'actions.delete' | translate }}</button>
			</ff-dropdown>
		</ng-template>
	`
})

export class RecurringInvoicesComponent implements OnInit {

	loading = false;
	invoices: RecurringInvoice[];
	tableOptions: TableOptions;

	@ViewChild('actionsColumn', { static: true }) actionsColumn: TemplateRef<any>;

	constructor(private invoiceService: InvoiceService,
				private translate: TranslateService,
				private router: Router,
				private dialogService: DialogService,
				private numberPipe: NumberPipe,
				private datePipe: DatePipe) {
	}

	ngOnInit() {
		this.loading = true;
		this.invoiceService.getRecurringInvoices()
			.subscribe(invoices => {
				this.loading = false;
				this.invoices = invoices;
			});

		this.tableOptions = new TableOptions({
			columns: [
				{name: this.translate.instant('general.name'), prop: 'name', width: 30},
				{
					name: this.translate.instant('recurring-invoices.interval'),
					getDynamicValue: (row: RecurringInvoice) => {
						return this.translate.instant('recurring-invoices.intervals.' + row.interval_unit);
					},
					width: 20
				},
				{
					name: this.translate.instant('recurring-invoices.next-date'),
					prop: 'next_date',
					pipe: this.datePipe,
					width: 25
				},
				{
					name: this.translate.instant('general.amount_net'),
					pipe: this.numberPipe,
					width: 15,
					getDynamicValue: (invoice: RecurringInvoice) => {
						return LineUtils.getTotalNet(invoice.lines);
					},
					alignment: ColumnAlignment.Right
				},
				{width: 4, cellTemplate: this.actionsColumn},
			]
		});
	}

	createInvoice() {
		this.router.navigate(['/income/recurring-invoices/new']);
	}

	editInvoice(invoice: RecurringInvoice) {
		this.router.navigate([`/income/recurring-invoices/${invoice.id}`]);
	}

	deleteInvoice(invoice: RecurringInvoice) {
		this.dialogService.createConfirmRequest(
			this.translate.instant('invoices.delete-confirm-title'),
			this.translate.instant('invoices.delete-confirm-message'),
			null,
			null,
			DialogType.Danger,
		).subscribe((confirmed) => {
			if (confirmed) {
				let index = this.invoices.indexOf(invoice);
				this.invoices.splice(index, 1);
				this.invoiceService.deleteRecurringInvoice(invoice).subscribe();
			}
		})




	}
}
