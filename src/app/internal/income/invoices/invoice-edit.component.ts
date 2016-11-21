import {Component, OnInit, ViewChild} from '@angular/core';
import {Invoice} from "../../../models/invoice";
import {InvoiceLine} from "../../../models/invoice-line";
import {ActivatedRoute} from "@angular/router";
import {InvoiceService} from "../../../services/invoice.service";
import {Country} from "../../../models/country";
import {BootstrapService} from "../../../services/bootstrap.service";
import {State} from "../../../core/state";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {TranslateService} from "ng2-translate";
import {ModalComponent} from "../../../core/components/modal.component";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {FormValidator} from "../../../core/form-validator";
var moment = require('moment');

@Component({
    selector: 'nvry-invoice-edit',
    templateUrl: 'invoice-edit.component.html'
})
export class InvoiceEditComponent implements OnInit {

    private invoice: Invoice;
    private countries: Country[];

    private loading: boolean = false;
    private saving: boolean = false;
    private savingDraft: boolean = false;

    private form: FormGroup;
    private createMode: boolean = true;

    @ViewChild('previewModal') private previewModal: ModalComponent;

    constructor(private route: ActivatedRoute,
                private invoiceService: InvoiceService,
                private bootstrapService: BootstrapService,
                private state: State,
                private notificationService: NotificationsService,
                private translate: TranslateService,
                private fb: FormBuilder) {

        this.invoice = new Invoice();
        this.invoice.due_date = moment().add(1, 'M');
        this.invoice.customer_country_id = this.bootstrapService.getDefaultCountry().id;
        this.invoice.invoice_lines.push(new InvoiceLine());
        this.invoice.draft = true;


        this.loading = true;
        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.createMode = false;
                this.invoiceService.getInvoice(id)
                    .subscribe((invoice: Invoice) => {
                        this.loading = false;
                        this.invoice = invoice;
                    });
            } else {
                this.loading = false;
            }
        });

        this.countries = this.bootstrapService.getCountries();
    }

    ngOnInit() {
        this.form = this.fb.group({
            number: ["", FormValidator.number],
            date: ["", Validators.compose([Validators.required, FormValidator.date])],
            service_date_start: ["", Validators.compose([Validators.required, FormValidator.date])],
            service_date_end: ["", Validators.compose([Validators.required, FormValidator.date])],
            due_date: ["", Validators.compose([Validators.required, FormValidator.date])],
        });
    }

    get nextInvoiceNumber(): number {
        return this.state.nextInvoiceNumber;
    }

    get invoicePreviewURL(): string {
        return this.invoiceService.getPreviewURL(this.invoice);
    }

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

    saveDraft() {
        this.invoice.draft = true;
        this.savingDraft = true;
        this.save();
    }

    saveAndIssue() {
        this.invoice.draft = false;
        this.invoice.number = this.invoice.number || this.nextInvoiceNumber;
        this.save();
    }

    save() {

        this.saving = true;
        this.invoiceService.saveInvoice(this.invoice)
            .subscribe(
                invoice => {
                    if(!this.invoice.id && !this.invoice.draft) {
                        this.state.nextInvoiceNumber++;
                    }
                    this.invoice = invoice;
                    this.saving = false;
                    this.savingDraft = false;
                    this.createMode = false;
                    this.notificationService.success(null, this.translate.instant('invoices.edit-success'));
                },
                error => {
                    // TODO
                });

    }

    showPreview() {
        let url = this.invoiceService.getPreviewURL(this.invoice);

        this.previewModal.show();
    }

    downloadPDF() {
        this.invoiceService.downloadInvoicePDF(this.invoice);
    }

}
