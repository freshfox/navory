import {Component, ComponentRef, OnInit} from "@angular/core";
import {Invoice, InvoiceStatus} from '../../../models/invoice';
import {Line} from "../../../models/invoice-line";
import {ActivatedRoute} from "@angular/router";
import {InvoiceService} from "../../../services/invoice.service";
import {BootstrapService} from "../../../services/bootstrap.service";
import {State} from "../../../core/state";
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormValidator} from "../../../core/form-validator";
import {Location} from "@angular/common";
import {Helpers} from "../../../core/helpers";
import {InvoiceBookPaymentComponent} from "../../payments/invoice-book-payment.component";
import {Payment} from "../../../models/payment";
import {Observable} from "rxjs";
import {NotificationsService} from "angular2-notifications";
import {DocumentPreviewComponent} from "../../../core/components/document-preview.component";
import {PaymentService} from "../../../services/payment.service";
import {ServiceError, ServiceErrorCode} from "../../../services/base.service";
import {SubscriptionService} from "../../../services/subscription.service";
import {AnalyticsEventType, AnalyticsService} from "../../../services/analytics.service";
import {ModalService, ModalSize} from "../../../lib/ffc-angular/services/modal.service";
import {QuoteService} from "../../../services/quote.service";
import {Quote} from "../../../models/quote.model";
const moment = require('moment');

@Component({
	selector: 'nvry-invoice-edit',
	templateUrl: './invoice-edit.component.html'
})
export class InvoiceEditComponent implements OnInit {

	invoice: Invoice;

	loading: boolean = false;
	saving: boolean = false;
	savingDraft: boolean = false;

	form: FormGroup;
	createMode: boolean = true;

	constructor(private route: ActivatedRoute,
				private invoiceService: InvoiceService,
				private bootstrapService: BootstrapService,
				private state: State,
				private notificationService: NotificationsService,
				private translate: TranslateService,
				private modalService: ModalService,
				private fb: FormBuilder,
				private location: Location,
				private paymentService: PaymentService,
				private subscriptionService: SubscriptionService,
				private analytics: AnalyticsService,
				private quoteService: QuoteService) {

		this.invoice = new Invoice();
		this.invoice.due_date = moment().add(30, 'd').toDate();
		this.invoice.customer_country_code = this.bootstrapService.getDefaultCountry().code;
		this.invoice.lines.push(new Line());
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
				this.route.queryParams.subscribe(params => {
					let quoteId = params['fromQuote'];
					if (quoteId) {
						this.quoteService.getQuote(quoteId)
							.subscribe((quote: Quote) => {

								this.invoice.customer = quote.customer;
								this.invoice.customer_name = quote.customer_name;
								this.invoice.customer_address = quote.customer_address;
								this.invoice.customer_country_code = quote.customer_country_code;
								this.invoice.customer_vat_number = quote.customer_vat_number;
								this.invoice.lines = quote.lines;
								this.invoice.lines.forEach((line) => {
									line.id = undefined;
								});

								this.loading = false;
							});
					} else {
						this.loading = false;
					}
				});
			}
		});
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

	getTotalNet() {
		return this.invoice.getTotalNet();
	}

	getTotalGross() {
		return this.invoice.getTotalGross();
	}

	getOccuringTaxRates() {
		return this.invoiceService.getTaxAmounts(this.invoice);
	}

	getBadgeData() {
		return this.invoiceService.getBadgeData(this.invoice);
	}

	getInvoiceStatus(): InvoiceStatus {
		return this.invoiceService.getInvoiceStatus(this.invoice);
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

	canAddPayment(): boolean {
		return !this.invoice.draft && !this.invoice.isFullyPaid && !this.invoice.canceled;
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

	cancelInvoice() {
		this.modalService.createConfirmRequest(
			this.translate.instant('invoices.cancel-confirm-title'),
			this.translate.instant('invoices.cancel-confirm-message'),
			() => {
				// cancel, do nothing
				this.modalService.hideCurrentModal();
			},
			() => {
				this.invoice.canceled = true;

				this.save(this.invoice)
					.subscribe((invoice: Invoice) => {
						this.invoice = invoice;
						this.notificationService.success(null, this.translate.instant('invoices.cancel-success'));
					});

				this.modalService.hideCurrentModal();
			},
			this.translate.instant('invoices.cancel')
		)
	}

}
