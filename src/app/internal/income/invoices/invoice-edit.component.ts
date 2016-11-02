import { Component, OnInit } from '@angular/core';
import {Invoice} from "../../../models/invoice";
import {InvoiceLine} from "../../../models/invoice-line";
import {ActivatedRoute} from "@angular/router";
import {InvoiceService} from "../../../services/invoice.service";
import {Country} from "../../../models/country";
import {BootstrapService} from "../../../services/bootstrap.service";

@Component({
    selector: 'nvry-invoice-edit',
    templateUrl: 'invoice-edit.component.html'
})
export class InvoiceEditComponent implements OnInit {

    private invoice: Invoice;
    private countries: Country[];

    private loading: boolean = false;
    private saving: boolean = false;

    constructor(private route: ActivatedRoute, private invoiceService: InvoiceService, private bootstrapService: BootstrapService) {
        this.invoice = new Invoice();
        this.invoice.invoice_lines.push(new InvoiceLine());


        this.loading = true;
        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.invoiceService.getInvoice(id)
                    .subscribe((invoice: Invoice) => {
                        this.loading = false;
                        this.invoice = invoice;
                    });
            } else {
                this.loading = false;
            }
        });

        this.bootstrapService.getCountries()
            .subscribe(countries => this.countries = countries);
    }

    ngOnInit() { }

    addLine() {
        this.invoice.invoice_lines.push(new InvoiceLine());
    }

    deleteLine(invoiceLine) {
        this.invoice.invoice_lines = this.invoice.invoice_lines.filter((line) => {
            return line !== invoiceLine;
        });
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

        this.saving = true;
        this.invoiceService.saveInvoice(this.invoice)
            .subscribe(
                invoice => {
                    this.invoice = invoice;
                    this.saving = false;
                },
                error => {
                    // TODO
                });

    }

}
