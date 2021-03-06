import {Component, OnInit} from '@angular/core';
import {Invoice, InvoiceStatus} from '../../../models/invoice';
import {ActivatedRoute} from '@angular/router';
import {InvoiceService} from '../../../services/invoice.service';
import {BootstrapService} from '../../../services/bootstrap.service';
import {State} from '../../../core/state';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormValidator} from '../../../core/form-validator';
import {Location} from '@angular/common';
import {Helpers} from '../../../core/helpers';
import {InvoiceBookPaymentComponent} from '../../payments/invoice-book-payment.component';
import {Payment} from '../../../models/payment';
import {Observable} from 'rxjs';
import {DialogService, ServiceError, ServiceErrorCode, SnackBarService} from '@freshfox/ng-core';
import {PaymentService} from '../../../services/payment.service';
import {QuoteService} from '../../../services/quote.service';
import {Quote} from '../../../models/quote.model';
import {InvoiceUtils} from '../../../utils/invoice-utils';
import {LineUtils} from '../../../utils/line-utils';
import {AccountService} from '../../../services/account.service';
import {switchMap} from 'rxjs/operators';
import {DocumentPreviewOverlayComponent} from '../../../core/components/document-preview-overlay.component';

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

	locales = [
		{
			id: 'de',
			name: 'Deutsch'
		},
		{
			id: 'en',
			name: 'Englisch'
		}
	];

	constructor(private route: ActivatedRoute,
				private invoiceService: InvoiceService,
				private bootstrapService: BootstrapService,
				private state: State,
				private snackbar: SnackBarService,
				private translate: TranslateService,
				private dialogService: DialogService,
				private fb: FormBuilder,
				private location: Location,
				private paymentService: PaymentService,
				private accountService: AccountService,
				private quoteService: QuoteService) {

		this.invoice = new Invoice();
		this.invoice.due_date = moment().add(30, 'd').toDate();
		this.invoice.customer_country_code = this.bootstrapService.getDefaultCountry().code;
		this.invoice.lines.push(LineUtils.newLine());
		this.invoice.draft = true;
		this.invoice.locale = 'de';


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
					let copyId = params['copy'];

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
					} else if (copyId) {
						this.invoiceService.getInvoice(copyId)
							.subscribe(invoice => {
								this.invoice.customer = invoice.customer;
								this.invoice.customer_name = invoice.customer_name;
								this.invoice.customer_address = invoice.customer_address;
								this.invoice.customer_country_code = invoice.customer_country_code;
								this.invoice.customer_vat_number = invoice.customer_vat_number;
								this.invoice.service_date_start = invoice.service_date_start;
								this.invoice.service_date_end = invoice.service_date_end;
								this.invoice.lines = invoice.lines;
								this.invoice.comment = invoice.comment;
								this.invoice.locale = invoice.locale;
								this.invoice.group_prefix = invoice.group_prefix;
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
			number: ['', FormValidator.number],
			date: ['', Validators.compose([Validators.required, FormValidator.date])],
			service_date_start: ['', Validators.compose([Validators.required, FormValidator.date])],
			service_date_end: ['', Validators.compose([Validators.required, FormValidator.date])],
			due_date: ['', Validators.compose([Validators.required, FormValidator.date])],
		});
	}

	localeChanged(locale: string) {
		this.invoice.locale = locale;
	}

	get invoiceNumber() {
		return InvoiceUtils.getCompleteNumber(this.invoice);
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
					this.snackbar.success(this.translate.instant('invoices.edit-success'));
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
				this.snackbar.success(this.translate.instant('invoices.issue-success'));
			});
		}
	}

	saveOnly() {
		if (this.form.valid) {
			let invoice = new Invoice(this.invoice);
			this.save(invoice).subscribe((invoice) => {
				this.invoice = invoice;
				this.snackbar.success(this.translate.instant('invoices.edit-success'));
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

							if (error.code === ServiceErrorCode.ValidationError) {
								if (error.data['number'].indexOf('NOT_UNIQUE') > -1) {
									this.form.controls.number.setErrors({invoiceNumberNotUnique: true})
									this.snackbar.error(this.translate.instant('invoices.save-error'));
								}
							} else {
								this.snackbar.error(this.translate.instant('invoices.save-error' + ' CODE: ' + error.code));
							}

							observer.error();
							observer.complete();
						});

			});

			return complete;
		}
	}

	showPreview() {
		const ref = this.dialogService.create(DocumentPreviewOverlayComponent, {
			clean: true,
			parameters: {
				url: this.invoicePreviewURL
			},
		});
	}

	downloadPDF() {
		this.invoiceService.downloadInvoicePDF(this.invoice);
	}

	addPayment() {
		const ref = this.dialogService.create(InvoiceBookPaymentComponent, {
			parameters: {
				invoiceId: this.invoice.id,
				amount: this.invoice.unpaid_amount,
				description: this.translate.instant('payments.default-invoice-description', {number: this.invoice.number})
			}
		})

		ref.componentInstance.onSaved.subscribe((payment: Payment) => {
			this.invoice.payments.push(payment);
			ref.close();
		});

		ref.componentInstance.onCancel.subscribe(() => {
			ref.close();
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
		this.dialogService.createConfirmRequest(
			this.translate.instant('invoices.cancel-confirm-title'),
			this.translate.instant('invoices.cancel-confirm-message'),
			this.translate.instant('invoices.cancel')
		).subscribe(confirmed => {
			if (confirmed) {
				this.invoice.canceled = true;

				this.save(this.invoice)
					.subscribe((invoice: Invoice) => {
						this.invoice = invoice;
						this.snackbar.success(this.translate.instant('invoices.cancel-success'));
					});
			}
		})
	}

	sendEmail() {
		this.accountService.getEmailSettings()
			.pipe(switchMap(settings => {
				if (settings && settings.length) {
					return this.invoiceService.sendInvoiceEmail(this.invoice.id, settings[0].id)
				}

				throw Error();
			}))
			.subscribe(() => {
				this.snackbar.success('Email versendet.');
			}, () => {
				this.snackbar.error('Email konnte nicht gesendet werden. Bitte überprüfe die Konfiguration in den Einstellungen.');
			});

	}
}
