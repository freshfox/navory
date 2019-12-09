import {Component, ComponentRef, OnInit} from "@angular/core";
import {Line} from "../../models/invoice-line";
import {ActivatedRoute, Router} from "@angular/router";
import {BootstrapService} from "../../services/bootstrap.service";
import {State} from "../../core/state";
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormValidator} from "../../core/form-validator";
import {Location} from "@angular/common";
import {Helpers} from "../../core/helpers";
import {Observable} from "rxjs";
import {SnackBarService} from '@freshfox/ng-core';
import {DocumentPreviewComponent} from "../../core/components/document-preview.component";
import {ServiceError, ServiceErrorCode} from "../../services/base.service";
import {SubscriptionService} from "../../services/subscription.service";
import {AnalyticsEventType, AnalyticsService} from "../../services/analytics.service";
import {ModalService, ModalSize} from "../../lib/ffc-angular/services/modal.service";
import {QuoteService} from "../../services/quote.service";
import {Quote} from "../../models/quote.model";
import {LineUtils} from '../../utils/line-utils';
const moment = require('moment');

@Component({
	selector: 'nvry-quote-edit',
	templateUrl: './quote-edit.component.html'
})
export class QuoteEditComponent implements OnInit {

	quote: Quote;

	loading: boolean = false;
	saving: boolean = false;
	savingDraft: boolean = false;

	form: FormGroup;
	createMode: boolean = true;

	constructor(private route: ActivatedRoute,
				private quoteService: QuoteService,
				private bootstrapService: BootstrapService,
				private state: State,
				private snackbar: SnackBarService,
				private translate: TranslateService,
				private modalService: ModalService,
				private fb: FormBuilder,
				private location: Location,
				private subscriptionService: SubscriptionService,
				private analytics: AnalyticsService,
				private router: Router) {

		this.quote = new Quote();
		this.quote.valid_to_date = moment().add(30, 'd').toDate();
		this.quote.customer_country_code = this.bootstrapService.getDefaultCountry().code;
		this.quote.lines.push(LineUtils.newLine());
		this.quote.draft = true;


		this.loading = true;
		this.route.params.subscribe(params => {
			let id = params['id'];
			if (id) {
				this.createMode = false;
				this.quoteService.getQuote(id)
					.subscribe((quote: Quote) => {
						this.loading = false;
						this.quote = quote;
					});
			} else {
				this.loading = false;
			}
		});
	}

	ngOnInit() {
		this.form = this.fb.group({
			number: ["", FormValidator.number],
			date: ["", Validators.compose([Validators.required, FormValidator.date])],
			valid_to_date: ["", Validators.compose([Validators.required, FormValidator.date])],
		});
	}

	get nextQuoteNumber(): number {
		return this.state.nextQuoteNumber;
	}

	get quotePreviewURL(): string {
		return this.quoteService.getPreviewURL(this.quote);
	}

	getTotalNet() {
		return this.quote.getTotalNet();
	}

	getTotalGross() {
		return this.quote.getTotalGross();
	}

	getOccuringTaxRates() {
		return this.quoteService.getTaxAmounts(this.quote);
	}

	saveDraft() {
		if (this.form.valid) {
			this.savingDraft = true;

			let quote = new Quote(this.quote);
			quote.draft = true;
			this.save(quote).subscribe((quote) => {
					this.quote = quote;
					this.snackbar.success(this.translate.instant('quotes.edit-success'));
				},
				() => {
					this.savingDraft = false;
				});
		}
	}

	saveAndIssue() {
		if (this.form.valid) {
			let quote = new Quote(this.quote);
			quote.draft = false;
			this.save(quote).subscribe((quote) => {
				this.quote = quote;
				this.state.nextQuoteNumber++;
				this.snackbar.success(this.translate.instant('quotes.issue-success'));
			});
		}
	}

	saveOnly() {
		if (this.form.valid) {
			let quote = new Quote(this.quote);
			this.save(quote).subscribe((quote) => {
				this.quote = quote;
				this.snackbar.success(this.translate.instant('quotes.edit-success'));
			});
		}
	}

	private save(quote: Quote): Observable<any> {
		Helpers.validateAllFields(this.form);
		if (this.form.valid) {
			this.saving = true;

			let complete = new Observable(observer => {
				this.quoteService.saveQuote(quote)
					.subscribe((updatedQuote: Quote) => {
							if (!quote.id && updatedQuote.id) {
								this.location.replaceState(`/quotes/${updatedQuote.id}`);
							}

							this.saving = false;
							this.savingDraft = false;
							this.createMode = false;

							observer.next(updatedQuote);
							observer.complete();
						},
						(error: ServiceError) => {
							this.saving = false;

							if (error.code === ServiceErrorCode.Forbidden) {
								this.subscriptionService.showUpgradeModal();
							} else {
								this.snackbar.error( this.translate.instant('quotes.save-error'));
							}

							observer.error();
							observer.complete();
						});

			});

			return complete;
		}
	}

	showPreview() {
		this.analytics.trackEvent(AnalyticsEventType.QuotePreview);
		this.modalService.create(DocumentPreviewComponent, {
			parameters: {
				url: this.quotePreviewURL
			},
			clean: true,
			size: ModalSize.FullWidth,
			showCloseButton: true
		}).subscribe((ref: ComponentRef<DocumentPreviewComponent>) => {

		});
	}

	downloadPDF() {
		this.quoteService.downloadQuotePDF(this.quote);
	}

	convertToInvoice() {
		this.save(this.quote).subscribe(() => {
			this.router.navigate([`/invoices/new`], {
				queryParams: {fromQuote: this.quote.id}
			});
		})
	}
}
