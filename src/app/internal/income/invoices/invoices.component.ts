import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {TableOptions} from "../../../core/components/table/table-options.model";
import {TranslateService} from "ng2-translate";
import {SortDirection} from "../../../core/components/table/sort-direction.enum";
import {Invoice, InvoiceStatus} from "../../../models/invoice";
import {InvoiceService} from "../../../services/invoice.service";
import {DatePipe} from "../../../core/pipes/date.pipe";
import {NumberPipe} from "../../../core/pipes/number.pipe";
import {ColumnAlignment} from "../../../core/components/table/column-alignment.enum";
import {Router} from "@angular/router";
var moment = require('moment');

@Component({
    selector: 'nvry-invoices',
    templateUrl: 'invoices.component.html'
})
export class InvoicesComponent implements OnInit {

    private invoices: Invoice[];

    @ViewChild('statusColumn') statusColumnTpl: TemplateRef<any>;
    @ViewChild('actionsColumn') actionsColumn: TemplateRef<any>;
    private loading: boolean = false;
    private tableOptions: TableOptions;

    constructor(private translate: TranslateService,
                private invoiceService: InvoiceService,
                private datePipe: DatePipe,
                private numberPipe: NumberPipe,
                private router: Router) {
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
                {name: this.translate.instant('invoices.status'), cellTemplate: this.statusColumnTpl, width: 12, getDynamicValue: this.getInvoiceStatus.bind(this) },
                {name: this.translate.instant('general.number-abbrev'), prop: 'number', width: 7, sortDirection: SortDirection.Desc },
                {name: this.translate.instant('general.customer'), prop: 'customer_name', width: 30},
                {name: this.translate.instant('invoices.date-created'), prop: 'date', pipe: this.datePipe, width: 12},
                {name: this.translate.instant('invoices.date-due'), prop: 'due_date', pipe: this.datePipe, width: 12},
                {name: this.translate.instant('general.amount_net'), prop: 'amount', pipe: this.numberPipe, width: 15, alignment: ColumnAlignment.Right},
                {width: 6, cellTemplate: this.actionsColumn},
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
        // TODO
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
            } else if (this.isInvoiceOverdue(invoice)) {
                status = InvoiceStatus.Overdue;
            }
        }

        return status;
    }

    isInvoicePaid(invoice) {
        return !!invoice.payment_date;
    }

    isInvoiceOverdue (invoice) {
        if(!this.isInvoicePaid(invoice)) {
            return moment().startOf('day').isAfter(invoice.due_date);
        }

        return false;
    }

}
