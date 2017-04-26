import {Component, ComponentRef, OnInit} from "@angular/core";
import {IncomeService} from "../../../services/income.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {TaxRateService} from "../../../services/tax-rate.service";
import {State} from "../../../core/state";
import {Income} from "../../../models/income";
import {FormValidator} from "../../../core/form-validator";
import {Helpers} from "../../../core/helpers";
import {ErrorHandler} from "../../../core/error-handler";
import {TaxRate} from "../../../models/tax-rate";
import {BootstrapService} from "../../../services/bootstrap.service";
import {EuVatType} from "../../../core/enums/eu-vat-type.enum";
import {FieldValidationError, ServiceError} from "../../../services/base.service";
import {NotificationsService} from "angular2-notifications";
import {TranslateService} from "@ngx-translate/core";
import {ModalService} from "../../../core/modal.module";
import {IncomeBookPaymentComponent} from "../../payments/income-book-payment.component";
import {Payment} from "../../../models/payment";
import {Location} from "@angular/common";
import {PaymentService} from "../../../services/payment.service";

@Component({
	selector: 'nvry-income-edit',
	templateUrl: './income-edit.component.html'
})
export class IncomeEditComponent implements OnInit {

	loading: boolean = false;
	saving: boolean = false;
	form: FormGroup;
	alertMessage: string;
	nextIncomeNumber: number;

	euVatTypes: any;
	taxRates: TaxRate[];
	income: Income;


	constructor(private incomeService: IncomeService,
				private fb: FormBuilder,
				private route: ActivatedRoute,
				private taxRateService: TaxRateService,
				private state: State,
				private errorHandler: ErrorHandler,
				private bootstrapService: BootstrapService,
				private notificationService: NotificationsService,
				private translate: TranslateService,
				private modalService: ModalService,
				private location: Location,
				private paymentService: PaymentService) {

		this.income = new Income();
		this.nextIncomeNumber = this.state.nextIncomeNumber;

		this.taxRateService.getDefaultTaxRate()
			.subscribe(rate => {
				if (!this.income.tax_rate) {
					this.income.tax_rate = rate;
				}
			});

		this.taxRateService.getFormattedTaxRates()
			.subscribe(taxRates => this.taxRates = taxRates);

		this.euVatTypes = this.bootstrapService.getFormattedEuVatTypes();

		this.form = this.fb.group({
			number: ["", FormValidator.number],
			date: ["", Validators.compose([Validators.required, FormValidator.date])],
			description: [""],
			price: ["", Validators.required],
		});
	}

	get isNew(): boolean {
		return !!this.income.id;
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			let id = params['id'];
			if (id) {
				this.loading = true;
				this.incomeService.getIncome(id)
					.subscribe((income: Income) => {
						this.income = income;
						this.loading = false;
					});
			} else {
				this.route.queryParams.subscribe(params => {
					let copyId = params['copy'];
					if (copyId) {
						this.incomeService.getIncome(copyId)
							.subscribe((income: Income) => {
								this.income.description = income.description;
								this.income.price = income.price;
								this.income.category = income.category;
								this.income.eu_vat_type = income.eu_vat_type;

								this.taxRateService.getTaxRate(income.tax_rate.id)
									.subscribe((rate) => {
										this.income.tax_rate = rate;
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

	taxRateChanged(id: number) {
		this.taxRateService.getTaxRate(id)
			.subscribe(rate => {
				if (rate.rate !== 0) {
					this.income.eu_vat_type = EuVatType.None;
				}
				this.income.tax_rate = rate;
			});
	}

	save() {
		Helpers.validateAllFields(this.form);
		if (this.form.valid) {
			this.saving = true;
			this.incomeService.saveIncome(this.income)
				.subscribe(
					(income) => {
						let isNew = !this.income.id;
						if (isNew) {
							this.state.nextIncomeNumber++;
							this.location.replaceState(`/income/${income.id}`);
						}
						let file = this.income.file;
						this.income = income;
						this.income.file = file;

						this.saving = false;
						this.notificationService.success(null, this.translate.instant('income.save-success'));
					},
					(error: ServiceError) => {
						this.saving = false;
						if (error.data['number'] && error.data['number'].includes(FieldValidationError.NotUnique)) {
							this.form.controls['number'].setErrors({numberNotUnique: true});
						} else {
							this.alertMessage = this.errorHandler.getDefaultErrorMessage(error.code);
						}
					});
		}
	}

	getTotalNet() {
		return this.income.price;
	}

	getTotalGross() {
		return this.income.getAmountGross();
	}

	getOccuringTaxRates() {
		return [{
			rate: this.income.getTaxrate(),
			amount: this.income.getAmountGross(),
			netAmount: this.income.price
		}];
	}

	addPayment() {
		this.modalService.create(IncomeBookPaymentComponent, {
			parameters: {
				income: this.income,
				amount: this.income.unpaid_amount,
				description: this.translate.instant('payments.default-income-description', {number: this.income.number})
			}
		}).subscribe((ref: ComponentRef<IncomeBookPaymentComponent>) => {
			ref.instance.onSaved.subscribe((payment: Payment) => {
				this.income.payments.push(payment);
				this.modalService.hideCurrentModal();
			});

			ref.instance.onCancel.subscribe(() => {
				this.modalService.hideCurrentModal();
			});
		});
	}

	removePaymentLink(payment: Payment) {
		this.paymentService.removePaymentFromIncome(this.income, payment)
			.subscribe(() => {
				let index = this.income.payments.indexOf(payment);
				if (index > -1) {
					this.income.payments.splice(index, 1);
				}
			});
	}


}
