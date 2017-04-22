import {Component, OnInit, ViewChild, TemplateRef} from "@angular/core";
import {TableOptions} from "../../../core/components/table/table-options.model";
import {TranslateService} from "@ngx-translate/core";
import {SortDirection} from "../../../core/components/table/sort-direction.enum";
import {Invoice, InvoiceStatus} from "../../../models/invoice";
import {InvoiceService} from "../../../services/invoice.service";
import {DatePipe} from "../../../core/pipes/date.pipe";
import {NumberPipe} from "../../../core/pipes/number.pipe";
import {ColumnAlignment} from "../../../core/components/table/column-alignment.enum";
import {Router} from "@angular/router";
import {ModalService} from "../../../core/modal.module";
import {Calculator} from "../../../core/calculator";
var moment = require('moment');

@Component({
	selector: 'nvry-invoices',
	templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit {

	invoices: Invoice[] = [];

	@ViewChild('statusColumn') statusColumnTpl: TemplateRef<any>;
	@ViewChild('actionsColumn') actionsColumn: TemplateRef<any>;
	loading: boolean = false;
	tableOptions: TableOptions;

	constructor(private translate: TranslateService,
				private invoiceService: InvoiceService,
				private datePipe: DatePipe,
				private numberPipe: NumberPipe,
				private router: Router,
				private modalService: ModalService) {
	}

	ngOnInit() {
		this.loading = true;
		this.invoiceService.getInvoices()
			.subscribe(invoices => {
				this.loading = false;
				this.invoices = invoices;
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
					prop: 'number',
					width: 7,
					sortDirection: SortDirection.Desc
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

	createInvoice() {
		this.router.navigate(['/invoices/new']);
	}

	editInvoice(invoice: Invoice) {
		this.router.navigate([`/invoices/${invoice.id}`]);
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
			});
	}

	getBadgeData(invoice) {
		let text;
		let badgeClass;
		switch (this.getInvoiceStatus(invoice)) {
			case InvoiceStatus.Draft:
				text = this.translate.instant('general.draft');
				badgeClass = 'gray';
				break;
			case InvoiceStatus.Paid:
				text = this.translate.instant('general.paid');
				badgeClass = 'income';
				break;
			case InvoiceStatus.PartlyPaid:
				text = this.translate.instant('general.partly-paid');
				badgeClass = 'income-part';
				break;
			case InvoiceStatus.Overdue:
				text = this.translate.instant('general.overdue');
				badgeClass = 'expense';
				break;
			case InvoiceStatus.Issued:
				text = this.translate.instant('invoices.issued');
				badgeClass = 'customer';
				break;
			default:
				break;
		}

		return {
			text: text,
			cssClass: badgeClass
		};
	}

	getInvoiceStatus(invoice): InvoiceStatus {
		var status;
		if (invoice.draft) {
			status = InvoiceStatus.Draft;
		} else {
			status = InvoiceStatus.Issued;
			if (this.isInvoicePaid(invoice)) {
				status = InvoiceStatus.Paid;
			} else if (this.isInvoicePartlyPaid(invoice)) {
				status = InvoiceStatus.PartlyPaid;
			} else if (this.isInvoiceOverdue(invoice)) {
				status = InvoiceStatus.Overdue;
			}
		}

		return status;
	}

	private getInvoiceAmount(status: InvoiceStatus) {
		let amount = 0;
		this.invoices.forEach((invoice) => {
			if(this.getInvoiceStatus(invoice) == status) {
				amount = Calculator.add(amount, invoice.getTotalGross());
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
			amount = Calculator.add(amount, invoice.getTotalGross());
		});

		return amount;
	}

	isInvoicePaid(invoice) {
		return invoice.unpaid_amount == 0;
	}

	isInvoicePartlyPaid(invoice: Invoice) {
		return invoice.payments.length > 0 && !this.isInvoicePaid(invoice);
	}

	isInvoiceOverdue(invoice) {
		if (!this.isInvoicePaid(invoice)) {
			return moment().startOf('day').isAfter(invoice.due_date);
		}

		return false;
	}

}
