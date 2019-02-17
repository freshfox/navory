import {Component, OnInit} from '@angular/core';
import {IntervalUnit, Invoice, RecurringInvoice} from '../../../models/invoice';
import {InvoiceService} from '../../../services/invoice.service';
import {ActivatedRoute} from '@angular/router';
import {LineUtils} from '../../../utils/line-utils';
import {InvoiceUtils} from '../../../utils/invoice-utils';
import {ServiceError} from '../../../services/base.service';
import {Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {Helpers} from '../../../core/helpers';
import {DateFormatter} from '../../../core/date-formatter';
import {FormValidator} from '../../../core/form-validator';
import {Customer} from '../../../models/customer';

@Component({
	selector: 'recurring-invoice-edit-component',
	template: `
		<div class="page-header page-header--no-bottom-padding">
			<button ff-button class="ff-button--clear" [routerLink]="['/recurring-invoices']" icon="arrow-left">
				{{ 'recurring-invoices.title' | translate }}
			</button>
			<hr>
		</div>
		<div *ngIf="!loading">
			<div class="page-row button-row">
				<h1 class="module-title">
					<span
						*ngIf="!createMode">{{ 'recurring-invoices.edit-title' | translate }}</span>
					<span *ngIf="createMode">{{ 'recurring-invoices.create-title' | translate }}</span>
				</h1>

				<div class="buttons">
					<button ff-button (click)="save()"
							[loading]="saving">{{ 'general.save' | translate }}
					</button>
				</div>
			</div>

			<div class="default-section">
				<div class="invoice-edit-paper">

					<div class="invoice-edit-paper-section">
						<div class="frame">
							<div class="bit-50 customer-area">
								<ff-input type="text"
										  [(ngModel)]="invoice.name"
										  [formControl]="form.controls.name"
										  label="Name der wiederkehrenden Rechnung"></ff-input>

								<nvry-customer-selection [(customer)]="invoice.customer" (customerChange)="customerChanged($event)"></nvry-customer-selection>
								<ff-control-messages [control]="form.controls.customer"></ff-control-messages>
							</div>

							<div class="bit-50">
								<div class="frame frame--bit-spacing">
									<div class="bit-50">

										<ff-input type="text"
												  [(ngModel)]="invoice.group_prefix"
												  [label]="'invoices.group-prefix' | translate"></ff-input>

										<ff-select
											[label]="'recurring-invoices.interval' | translate"
											[options]="intervals"
											[selectedValue]="invoice.interval_unit"
											(selectedValueChange)="intervalUnitChanged($event)"></ff-select>

										<ff-input type="date"
												  [(ngModel)]="invoice.next_date"
												  [formControl]="form.controls.next_date"
												  [label]="'recurring-invoices.next-date' | translate"></ff-input>
									</div>
									<div class="bit-50">
										<ff-input type="number"
												  [(ngModel)]="invoice.count"
												  [label]="'recurring-invoices.count' | translate"></ff-input>
										
										

										<ff-select
											[label]="'general.language' | translate"
											[options]="locales"
											[selectedValue]="invoice.locale"
											(selectedValueChange)="localeChanged($event)"></ff-select>
									</div>
								</div>
							</div>
						</div>
					</div>

					<nvry-invoice-lines-edit [(lines)]="invoice.lines"></nvry-invoice-lines-edit>

					<div class="invoice-edit-paper-section invoice-total">
						<nvry-total-indicator [totalNet]="getTotalNet()" [totalGross]="getTotalGross()"
											  [rates]="getOccuringTaxRates()"></nvry-total-indicator>
					</div>

					<div class="invoice-edit-paper-section">
						<ff-textarea [label]="'general.note' | translate"
									 [placeholder]="'invoices.comment-placeholder' | translate"
									 [(ngModel)]="invoice.comment"></ff-textarea>
					</div>
				</div>
			</div>


		</div>

		<ff-spinner *ngIf="loading"></ff-spinner>
	`
})

export class RecurringInvoiceEditComponent implements OnInit {

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

	intervals;

	createMode = true;
	loading = false;
	saving = false;

	invoice: RecurringInvoice;

	form: FormGroup;

	constructor(private invoiceService: InvoiceService,
				private location: Location,
				private fb: FormBuilder,
				private route: ActivatedRoute,
				private translate: TranslateService,
				private snackbar: NotificationsService) {
		this.invoice = InvoiceUtils.newRecurringInvoice();
		this.invoice.lines.push(LineUtils.newLine());

		this.intervals = [
			{ id: IntervalUnit.WEEKLY, name: this.translate.instant('recurring-invoices.intervals.weekly')  },
			{ id: IntervalUnit.MONTHLY, name: this.translate.instant('recurring-invoices.intervals.monthly')  },
			{ id: IntervalUnit.QUARTERLY, name: this.translate.instant('recurring-invoices.intervals.quarterly')  },
			{ id: IntervalUnit.YEARLY, name: this.translate.instant('recurring-invoices.intervals.yearly')  },
		];
	}

	ngOnInit() {
		this.form = this.fb.group({
			name: ['', Validators.required],
			next_date: ["", Validators.compose([Validators.required, FormValidator.date])],
			customer: ["", Validators.required]
		});


		this.loading = true;
		this.route.params.subscribe(params => {
			let id = params['id'];
			if (id) {
				this.createMode = false;
				this.invoiceService.getRecurringInvoice(id)
					.subscribe((invoice: RecurringInvoice) => {
						this.loading = false;
						this.invoice = invoice;

						if (this.invoice.customer) {
							this.customerChanged(this.invoice.customer);
						}
					});
			} else {
				this.loading = false;
			}
		});
	}

	customerChanged(customer: Customer) {
		this.form.controls.customer.setValue(customer);
	}

	localeChanged(locale: string) {
		this.invoice.locale = locale;
	}

	intervalUnitChanged(unit: IntervalUnit) {
		this.invoice.interval_unit = unit;
	}

	getTotalNet() {
		return LineUtils.getTotalGross(this.invoice.lines);
	}

	getTotalGross() {
		return LineUtils.getTotalGross(this.invoice.lines);
	}

	getOccuringTaxRates() {
		return LineUtils.getTaxAmounts(this.invoice.lines);
	}

	save() {
		Helpers.validateAllFields(this.form);
		if (this.form.valid && this.invoice.customer) {
			this.saving = true;

			this.invoice.next_date = DateFormatter.formatDateForApi(this.invoice.next_date);
			this.invoiceService.saveRecurringInvoice(this.invoice)
				.subscribe((updatedInvoice: Invoice) => {
						if (!this.invoice.id && updatedInvoice.id) {
							this.location.replaceState(`/recurring-invoices/${updatedInvoice.id}`);
						}

						this.saving = false;
						this.createMode = false;
						this.snackbar.success(null, this.translate.instant('recurring-invoices.save-success'));
					},
					(error: ServiceError) => {
						this.saving = false;
						this.snackbar.error(this.translate.instant('recurring-invoices.save-error') + ' CODE: ' + error.code);
					});
		}
	}

}
