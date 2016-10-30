import { Component, OnInit } from '@angular/core';
import {Invoice} from "../../../models/invoice";
import {InvoiceLine} from "../../../models/invoice-line";
import {ActivatedRoute} from "@angular/router";
import {InvoiceService} from "../../../services/invoice.service";

@Component({
    selector: 'nvry-invoice-edit',
    templateUrl: 'invoice-edit.component.html'
})
export class InvoiceEditComponent implements OnInit {

    private invoice: Invoice;

    private loading: boolean = false;
    private saving: boolean = false;

    constructor(private route: ActivatedRoute, private invoiceService: InvoiceService) {
        this.invoice = new Invoice();
        this.invoice.invoice_lines.push(new InvoiceLine());

        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.loading = false;
                this.invoiceService.getInvoice(id)
                    .subscribe((invoice: Invoice) => {
                        this.invoice = invoice;
                        this.loading = false;
                    });
            } else {
                this.loading = false;
            }
        });
    }

    ngOnInit() { }

    addLine() {
        this.invoice.invoice_lines.push(new InvoiceLine());
    }

    getTotalNet() {
        return this.invoice.getTotalNet();
    }

    getTotalGross() {
        return this.invoice.getTotalGross();
    }

    getOccuringTaxRates() {
        return this.invoiceService.getTaxAmounts(this.invoice);
    }

    save() {

        this.invoiceService.saveInvoice(this.invoice)
            .subscribe(
                invoice => {

                },
                error => {
                    // TODO
                });

    }

}
