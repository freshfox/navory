import {AfterViewInit, Component, ComponentRef, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Invoice} from "../../../models/invoice";
import {InvoiceLine} from "../../../models/invoice-line";
import {ActivatedRoute} from "@angular/router";
import {InvoiceService} from "../../../services/invoice.service";
import {Country} from "../../../models/country";
import {BootstrapService} from "../../../services/bootstrap.service";
import {State} from "../../../core/state";
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormValidator} from "../../../core/form-validator";
import {Location} from "@angular/common";
import {Helpers} from "../../../core/helpers";
import {InvoiceBookPaymentComponent} from "../../payments/invoice-book-payment.component";
import {Payment} from "../../../models/payment";
import {CustomerService} from "../../../services/customer.service";
import {Customer} from "../../../models/customer";
import {CustomerEditComponent} from "../../customers/customer-edit.component";
import {Observable} from "rxjs";
import {NotificationsService} from "angular2-notifications";
import {DocumentPreviewComponent} from "../../../core/components/document-preview.component";
import {PaymentService} from "../../../services/payment.service";
import {ServiceError, ServiceErrorCode} from "../../../services/base.service";
import {SubscriptionService} from "../../../services/subscription.service";
import {AnalyticsEventType, AnalyticsService} from "../../../services/analytics.service";
import {ModalService, ModalSize} from "../../../core/ffc-angular/services/modal.service";
const moment = require('moment');
const AutoComplete = require('javascript-autocomplete');

@Component({
	selector: 'nvry-invoice-edit',
	templateUrl: './invoice-edit.component.html'
})
export class InvoiceEditComponent implements OnInit, AfterViewInit {

	invoice: Invoice;
	countries: Country[];

	loading: boolean = false;
	saving: boolean = false;
	savingDraft: boolean = false;

	form: FormGroup;
	createMode: boolean = true;

	@ViewChild('customerName') private customerName: ElementRef;

	constructor(private route: ActivatedRoute,
				private invoiceService: InvoiceService,
				private bootstrapService: BootstrapService,
				private state: State,
				private notificationService: NotificationsService,
				private translate: TranslateService,
				private modalService: ModalService,
				private fb: FormBuilder,
				private location: Location,
				private customerService: CustomerService,
				private paymentService: PaymentService,
				private subscriptionService: SubscriptionService,
				private analytics: AnalyticsService) {

		this.invoice = new Invoice();
		this.invoice.due_date = moment().add(1, 'M');
		this.invoice.customer_country_code = this.bootstrapService.getDefaultCountry().code;
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

	ngAfterViewInit() {
		this.initCustomerAutocomplete();
	}

	initCustomerAutocomplete() {
		let autocomplete = new AutoComplete({
			selector: this.customerName.nativeElement.querySelector('input'),
			delay: 50,
			minChars: 2,
			source: (term, response) => {
				this.customerService.searchCustomers(term)
					.subscribe(response);
			},
			renderItem: function (customer, search) {
				search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
				let re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
				return `<div class="autocomplete-suggestion" data-val="${customer.name}" data-id="${customer.id}">${customer.name.replace(re, "<b>$1</b>")}</div>`;
			},
			onSelect: (event, value, item) => {
				let id = item.dataset.id;
				this.customerService.getCustomer(id)
					.subscribe(customer => {
						this.updateCustomer(customer);
					});
			}
		});
	}

	private updateCustomer(customer: Customer) {
		this.invoice.customer = customer;
		this.invoice.customer_name = customer.name;
		this.invoice.customer_address = customer.address;
		this.invoice.customer_vat_number = customer.vat_number;
		this.invoice.customer_country_code = customer.country_code;
	}

	private removeCustomerLink() {
		this.invoice.customer = null;
	}

	private editCustomer() {
		this.modalService.create(CustomerEditComponent, {
			parameters: {
				customer: this.invoice.customer
			}
		}).subscribe((ref: ComponentRef<CustomerEditComponent>) => {
			ref.instance.onSaved.subscribe((savedCustomer: Customer) => {
				this.updateCustomer(savedCustomer);
				this.modalService.hideCurrentModal();
			});

			ref.instance.onCancel.subscribe(() => {
				this.modalService.hideCurrentModal();
			});
		});
	}

	saveCustomer() {
		let customer = new Customer();
		customer.name = this.invoice.customer_name;
		customer.address = this.invoice.customer_address;
		customer.country_code = this.invoice.customer_country_code;

		this.modalService.create(CustomerEditComponent, {
			parameters: {
				customer: customer
			}
		}).subscribe((ref: ComponentRef<CustomerEditComponent>) => {
			ref.instance.onSaved.subscribe((savedCustomer: Customer) => {
				this.updateCustomer(savedCustomer);
				this.modalService.hideCurrentModal();
			});

			ref.instance.onCancel.subscribe(() => {
				this.modalService.hideCurrentModal();
			});
		});
	}

	get nextInvoiceNumber(): number {
		return this.state.nextInvoiceNumber;
	}

	get invoicePreviewURL(): string {
		return this.invoiceService.getPreviewURL(this.invoice);
	}

	addLine() {
		let lastLine = this.invoice.invoice_lines[this.invoice.invoice_lines.length - 1];
		let lastTaxRate = lastLine.tax_rate;
		this.invoice.invoice_lines.push(new InvoiceLine({ tax_rate: lastTaxRate }));
	}

	deleteLine(invoiceLine) {
		this.invoice.invoice_lines = this.invoice.invoice_lines.filter((line) => {
			return line !== invoiceLine;
		});
	}

	copyLine(invoiceLine) {
		let index = this.invoice.invoice_lines.indexOf(invoiceLine);
		let lineCopy = new InvoiceLine(invoiceLine);

		this.invoice.invoice_lines.splice(index, 0, lineCopy);
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
		if (this.form.valid) {
			this.savingDraft = true;

			let invoice = new Invoice(this.invoice);
			invoice.draft = true;
			this.save(invoice).subscribe((invoice) => {
				this.invoice = invoice;
				this.notificationService.success(null, this.translate.instant('invoices.edit-success'));
			},
			() => {
				this.savingDraft = false;
			});
		}
	}

	saveAndIssue() {
		if (this.form.valid) {
			let invoice = new Invoice(this.invoice);
			invoice.draft = false;
			this.save(invoice).subscribe((invoice) => {
				this.invoice = invoice;
				this.state.nextInvoiceNumber++;
				this.notificationService.success(null, this.translate.instant('invoices.issue-success'));
			});
		}
	}

	saveOnly() {
		if (this.form.valid) {
			let invoice = new Invoice(this.invoice);
			this.save(invoice).subscribe((invoice) => {
				this.invoice = invoice;
				this.notificationService.success(null, this.translate.instant('invoices.edit-success'));
			});
		}
	}

	private save(invoice: Invoice): Observable<any> {
		Helpers.validateAllFields(this.form);
		if (this.form.valid) {
			this.saving = true;

			let complete = new Observable(observer => {
				this.invoiceService.saveInvoice(invoice)
					.subscribe((updatedInvoice: Invoice) => {
							if (!invoice.id && updatedInvoice.id) {
								this.location.replaceState(`/invoices/${updatedInvoice.id}`);
							}

							this.saving = false;
							this.savingDraft = false;
							this.createMode = false;

							observer.next(updatedInvoice);
							observer.complete();
						},
						(error: ServiceError) => {
							this.saving = false;

							if (error.code === ServiceErrorCode.Forbidden) {
								this.subscriptionService.showUpgradeModal();
							} else {
								this.notificationService.error(null, this.translate.instant('invoices.save-error'));
							}

							observer.error();
							observer.complete();
						});

			});

			return complete;
		}
	}

	showPreview() {
		this.analytics.trackEvent(AnalyticsEventType.InvoicePreview);
		this.modalService.create(DocumentPreviewComponent, {
			parameters: {
				url: this.invoicePreviewURL
			},
			clean: true,
			size: ModalSize.FullWidth,
			showCloseButton: true
		}).subscribe((ref: ComponentRef<DocumentPreviewComponent>) => {

		});
	}

	downloadPDF() {
		this.invoiceService.downloadInvoicePDF(this.invoice);
	}

	addPayment() {
		this.modalService.create(InvoiceBookPaymentComponent, {
			parameters: {
				invoiceId: this.invoice.id,
				amount: this.invoice.unpaid_amount,
				description: this.translate.instant('payments.default-invoice-description', {number: this.invoice.number})
			}
		}).subscribe((ref: ComponentRef<InvoiceBookPaymentComponent>) => {
			ref.instance.onSaved.subscribe((payment: Payment) => {
				this.invoice.payments.push(payment);
				this.modalService.hideCurrentModal();
			});

			ref.instance.onCancel.subscribe(() => {
				this.modalService.hideCurrentModal();
			});
		});
	}

	removePaymentLink(payment: Payment) {
		this.paymentService.removePaymentFromInvoice(this.invoice, payment)
			.subscribe(() => {
				let index = this.invoice.payments.indexOf(payment);
				if (index > -1) {
					this.invoice.payments.splice(index, 1);
				}
			});
	}

}
