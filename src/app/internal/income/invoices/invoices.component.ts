import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Invoice, InvoiceStatus} from '../../../models/invoice';
import {InvoiceService} from '../../../services/invoice.service';
import {DatePipe} from '../../../core/pipes/date.pipe';
import {Router} from '@angular/router';
import {Calculator} from '../../../core/calculator';
import {NumberPipe} from '../../../lib/ffc-angular/pipes/number.pipe';
import {ModalService} from '../../../lib/ffc-angular/services/modal.service';
import {TableOptions} from '../../../lib/ffc-angular/components/table/table-options.model';
import {SortDirection} from '../../../lib/ffc-angular/components/table/sort-direction.enum';
import {ColumnAlignment} from '../../../lib/ffc-angular/components/table/column-alignment.enum';
import {InvoiceUtils} from '../../../utils/invoice-utils';
import {LocalStorageService} from '../../../services/local-storage.service';

@Component({
	selector: 'nvry-invoices',
	templateUrl: './invoices.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesComponent implements OnInit {

	invoices: Invoice[] = [];
	filteredInvoices: Invoice[] = [];

	statusOptions: InvoiceStatus[] = Object.keys(InvoiceStatus).map(key => InvoiceStatus[key]);
	selectedStatusOptions: InvoiceStatus[];

	@ViewChild('statusColumn') statusColumnTpl: TemplateRef<any>;
	@ViewChild('actionsColumn') actionsColumn: TemplateRef<any>;
	loading: boolean = false;
	tableOptions: TableOptions;

	static readonly INVOICES_STATUS_FILTER_KEY = 'invoices_status_filter';

	constructor(private translate: TranslateService,
				private invoiceService: InvoiceService,
				private datePipe: DatePipe,
				private numberPipe: NumberPipe,
				private router: Router,
				private storage: LocalStorageService,
				private cdf: ChangeDetectorRef,
				private modalService: ModalService) {
		const options = this.storage.getObject(InvoicesComponent.INVOICES_STATUS_FILTER_KEY);
		this.selectedStatusOptions = options || this.statusOptions;
	}

	ngOnInit() {
		this.loading = true;
		this.invoiceService.getInvoices()
			.subscribe(invoices => {
				this.loading = false;
				this.invoices = invoices;
				this.filteredInvoices = invoices;
				this.selectedStatusOptionsChanged();
				this.cdf.detectChanges();
			});

		this.tableOptions = new TableOptions({
			columns: [
				{
					name: this.translate.instant('invoices.status'),
					cellTemplate: this.statusColumnTpl,
					width: 12,
					getDynamicValue: this.getInvoiceStatus.bind(this)
				},
				{
					name: this.translate.instant('general.number-abbrev'),
					width: 7,
					sortDirection: SortDirection.Desc,
					getDynamicValue: (invoice: Invoice) => {
						return InvoiceUtils.getCompleteNumber(invoice);
					}
				},
				{name: this.translate.instant('general.customer'), prop: 'customer_name', width: 30},
				{name: this.translate.instant('invoices.date-created'), prop: 'date', pipe: this.datePipe, width: 12},
				{name: this.translate.instant('invoices.date-due'), prop: 'due_date', pipe: this.datePipe, width: 12},
				{
					name: this.translate.instant('general.amount_net'),
					prop: 'amount',
					pipe: this.numberPipe,
					width: 15,
					alignment: ColumnAlignment.Right
				},
				{width: 4, cellTemplate: this.actionsColumn},
			]
		});
	}

	private getFilteredInvoices() {
		if (this.selectedStatusOptions.length === this.statusOptions.length) {
			return this.invoices;
		}

		return this.invoices.filter(invoice => {
			return this.selectedStatusOptions.indexOf(this.invoiceService.getInvoiceStatus(invoice)) >= 0;
		});
	}

	selectedStatusOptionsChanged() {
		this.refreshFilteredInvoices();
		this.storage.setObject(InvoicesComponent.INVOICES_STATUS_FILTER_KEY, this.selectedStatusOptions);
		this.cdf.detectChanges();
	}

	refreshFilteredInvoices() {
		this.filteredInvoices = this.getFilteredInvoices();
	}

	createInvoice() {
		this.router.navigate(['/invoices/new']);
	}

	editInvoice(invoice: Invoice) {
		this.router.navigate([`/invoices/${invoice.id}`]);
	}

	copyInvoice(invoice: Invoice) {
		this.router.navigate([`/invoices/new`], {
			queryParams: {copy: invoice.id}
		});
	}

	deleteInvoice(invoice: Invoice) {
		this.modalService.createConfirmRequest(
			this.translate.instant('invoices.delete-confirm-title'),
			this.translate.instant('invoices.delete-confirm-message'),
			() => {
				this.modalService.hideCurrentModal();
			},
			() => {
				let index = this.invoices.indexOf(invoice);
				this.invoices.splice(index, 1);
				this.invoiceService.deleteInvoice(invoice).subscribe();
				this.modalService.hideCurrentModal();
				this.refreshFilteredInvoices();
				this.cdf.detectChanges();
			});
	}

	getBadgeData(invoice: Invoice) {
		return this.invoiceService.getBadgeData(invoice);
	}

	getBadgeDataForStatus(status: InvoiceStatus) {
		return this.invoiceService.getBadgeDataForStatus(status);
	}

	getInvoiceStatus(invoice: Invoice): InvoiceStatus {
		return this.invoiceService.getInvoiceStatus(invoice);
	}

	private getInvoiceAmount(status: InvoiceStatus) {
		let amount = 0;
		this.invoices.forEach((invoice) => {
			if(this.getInvoiceStatus(invoice) == status) {
				amount = Calculator.add(amount, invoice.getTotalNet());
			}
		});

		return amount;
	}

	private getOverdueAmount(): number {
		return this.getInvoiceAmount(InvoiceStatus.Overdue);
	}

	private getIssuedAmount(): number {
		return this.getInvoiceAmount(InvoiceStatus.Issued);
	}

	private getDraftAmount(): number {
		return this.getInvoiceAmount(InvoiceStatus.Draft);
	}

	private getTotalAmount(): number {
		let amount = 0;
		this.invoices.forEach((invoice) => {
			amount = Calculator.add(amount, invoice.getTotalNet());
		});

		return amount;
	}
}
