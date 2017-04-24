import {Component, ComponentRef, OnInit} from "@angular/core";
import {ExpenseService} from "../../services/expense.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Expense} from "../../models/expense";
import {Category} from "../../models/category";
import {FormValidator} from "../../core/form-validator";
import {TaxRateService} from "../../services/tax-rate.service";
import {State} from "../../core/state";
import {ErrorHandler} from "../../core/error-handler";
import {Helpers} from "../../core/helpers";
import {BootstrapService} from "../../services/bootstrap.service";
import {EuVatType} from "../../core/enums/eu-vat-type.enum";
import {FieldValidationError, ServiceError} from "../../services/base.service";
import {Payment} from "../../models/payment";
import {ModalService, ModalSize} from "../../core/modal.module";
import {TranslateService} from "@ngx-translate/core";
import {ExpenseBookPaymentComponent} from "../payments/expense-book-payment.component";
import {NotificationsService} from "angular2-notifications";
import {Location} from "@angular/common";
import {ExpenseCategorySelectionComponent} from "./expense-category-selection.component";
import {PaymentService} from "../../services/payment.service";

@Component({
	templateUrl: './expense-edit.component.html'
})
export class ExpenseEditComponent implements OnInit {

	form: FormGroup;
	loading = false;
	saving = false;
	alertMessage: string;

	expense: Expense;
	taxRates;
	expenseCategories: Category[];
	euVatTypes: any[];
	private nextExpenseNumber: number;

	constructor(private expenseService: ExpenseService,
				private fb: FormBuilder,
				private route: ActivatedRoute,
				private notificationService: NotificationsService,
				private taxRateService: TaxRateService,
				private state: State,
				private errorHandler: ErrorHandler,
				private bootstrapService: BootstrapService,
				private modalService: ModalService,
				private translate: TranslateService,
				private location: Location,
				private paymentService: PaymentService) {

		this.expense = new Expense();
		this.expenseCategories = this.state.expenseCategories;
		this.nextExpenseNumber = this.state.nextExpenseNumber;

		this.taxRateService.getDefaultTaxRate()
			.subscribe(rate => {
				if (!this.expense.tax_rate) {
					this.expense.tax_rate = rate;
				}
			});

		this.taxRateService.getFormattedTaxRates()
			.subscribe(taxRates => this.taxRates = taxRates);

		this.euVatTypes = this.bootstrapService.getFormattedEuVatTypes();

		this.route.params.subscribe(params => {
			let id = params['id'];
			if (id) {
				this.loading = true;
				this.expenseService.getExpense(id)
					.subscribe((expense: Expense) => {
						this.expense = expense;
						this.loading = false;
					});
			} else {
				this.route.queryParams.subscribe(params => {
					let copyId = params['copy'];
					if (copyId) {
						this.expenseService.getExpense(copyId)
							.subscribe((expense: Expense) => {
								console.log(expense);
								this.expense.description = expense.description;
								this.expense.price = expense.price;
								this.expense.category = expense.category;
								this.expense.eu_tax_rate = expense.eu_tax_rate;
								this.expense.eu_vat_type = expense.eu_vat_type;

								this.taxRateService.getTaxRate(expense.tax_rate.id)
									.subscribe((rate) => {
										this.expense.tax_rate = rate;
									});

								this.taxRateService.getTaxRate(expense.eu_tax_rate.id)
									.subscribe((rate) => {
										this.expense.eu_tax_rate = rate;
									});

								this.loading = false;
							});
					} else {
						this.loading = false;
					}
				});
			}
		});

		this.form = this.fb.group({
			number: ["", FormValidator.number],
			date: ["", Validators.compose([Validators.required, FormValidator.date])],
			description: [""],
			price: ["", Validators.required],
		});
	}

	ngOnInit() {
	}

	get isNew(): boolean {
		return !!this.expense.id;
	}

	euVatTypeChanged() {
		if (this.expense.eu_vat_type == EuVatType.None) {
			this.expense.eu_tax_rate = null;
		}
	}

	taxRateChanged(id: number) {
		this.taxRateService.getTaxRate(id)
			.subscribe(rate => {
				if (rate.rate !== 0) {
					this.expense.eu_vat_type = EuVatType.None;
					this.expense.eu_tax_rate = null;
				}
				this.expense.tax_rate = rate;
			});
	}

	euTaxRateChanged(id: number) {
		this.taxRateService.getTaxRate(id)
			.subscribe(rate => {
				this.expense.eu_tax_rate = rate;
			})
	}

	showCategories() {
		this.modalService.create(ExpenseCategorySelectionComponent, {
			parameters: {
				categories: this.expenseCategories
			},
			size: ModalSize.Large
		}).subscribe((ref: ComponentRef<ExpenseCategorySelectionComponent>) => {
			ref.instance.categorySelected.subscribe((category: Category) => {
				this.modalService.hideCurrentModal();
				this.categorySelected(category);
			});
		});
	}

	categorySelected(category: Category) {
		this.expense.category = category;
	}

	save() {
		Helpers.validateAllFields(this.form);
		if (this.form.valid) {
			this.saving = true;
			this.expenseService.saveExpense(this.expense)
				.subscribe(
					(expense) => {
						let isNew = !this.expense.id;
						if (isNew) {
							this.state.nextExpenseNumber++;
							this.location.replaceState(`/expenses/${expense.id}`);
						}
						this.expense = expense;
						this.saving = false;
						this.notificationService.success(null, this.translate.instant('expenses.save-success'));
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
		return this.expense.price;
	}

	getTotalGross() {
		return this.expense.getAmountGross();
	}

	getOccuringTaxRates() {
		return [{
			rate: this.expense.getTaxrate(),
			amount: this.expense.getTaxAmount(),
			netAmount: this.expense.price
		}];
	}

	addPayment() {
		this.modalService.create(ExpenseBookPaymentComponent, {
			parameters: {
				expense: this.expense,
				amount: this.expense.unpaid_amount,
				description: this.translate.instant('payments.default-expense-description', {number: this.expense.number})
			}
		}).subscribe((ref: ComponentRef<ExpenseBookPaymentComponent>) => {
			ref.instance.onSaved.subscribe((payment: Payment) => {
				this.expense.payments.push(payment);
				this.modalService.hideCurrentModal();
			});

			ref.instance.onCancel.subscribe(() => {
				this.modalService.hideCurrentModal();
			});
		});
	}

	removePaymentLink(payment: Payment) {
		this.paymentService.removePaymentFromExpense(this.expense, payment)
			.subscribe(() => {
				let index = this.expense.payments.indexOf(payment);
				if (index > -1) {
					this.expense.payments.splice(index, 1);
				}
			});
	}

}
