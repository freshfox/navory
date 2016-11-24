import {Component, OnInit, ViewChild} from '@angular/core';
import {ExpenseService} from "../../services/expense.service";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Expense} from "../../models/expense";
import {ModalComponent} from "../../core/components/modal.component";
import {Category} from "../../models/category";
import {FormValidator} from "../../core/form-validator";
import {TaxRateService} from "../../services/tax-rate.service";
import {State} from "../../core/state";
import {ErrorHandler} from "../../core/error-handler";
import {Helpers} from "../../core/helpers";
import {BootstrapService} from "../../services/bootstrap.service";
import {EuVatType} from "../../core/enums/eu-vat-type.enum";
import {ServiceError, FieldValidationError} from "../../services/base.service";

@Component({
    templateUrl: 'expense-edit.component.html'
})
export class ExpenseEditComponent implements OnInit {

    private form: FormGroup;
    private loading = false;
    private saving = false;
    private alertMessage: string;

    private expense: Expense;
    private taxRates;
    private expenseCategories: Category[];
    private euVatTypes: any[];
    private nextExpenseNumber: number;

    @ViewChild('selectCategory') private selectCategoryModal: ModalComponent;


    constructor(private expenseService: ExpenseService,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private taxRateService: TaxRateService,
                private state: State,
                private errorHandler: ErrorHandler,
                private bootstrapService: BootstrapService) {

        this.expense = new Expense();
        this.expenseCategories = this.state.expenseCategories;
        this.nextExpenseNumber = this.state.nextExpenseNumber;

        this.taxRateService.getDefaultTaxRate()
            .subscribe(rate => {
                if(!this.expense.tax_rate) {
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
                this.loading = false;
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

    taxRateChanged(id: number) {
        this.taxRateService.getTaxRate(id)
            .subscribe(rate => {
                if(rate.rate !== 0) {
                    this.expense.eu_vat_type = EuVatType.None;
                }
                this.expense.tax_rate = rate;
            });
    }

    euTaxRateChanged(id: number) {
        this.taxRateService.getTaxRate(id)
            .subscribe(rate => {
                this.expense.eu_vat_tax_rate = rate;
            })
    }

    showCategories() {
        this.selectCategoryModal.show();
    }

    categorySelected(category: Category) {
        this.selectCategoryModal.hide();
        this.expense.category = category;
    }

    save() {
        Helpers.validateAllFields(this.form);
        if(this.form.valid) {
            this.saving = true;
            this.expenseService.saveExpense(this.expense)
                .subscribe(
                    (expense) => {
                        let isNew = !this.expense.id;
                        if(isNew) {
                            this.state.nextExpenseNumber++;
                        }
                        this.expense = expense;
                        this.saving = false;
                        this.router.navigate(['/expenses']);
                    },
                    (error: ServiceError) => {
                        this.saving = false;
                        if(error.data['number'].includes(FieldValidationError.NotUnique)) {
                            this.form.controls['number'].setErrors({ numberNotUnique: true });
                        } else {
                            this.alertMessage = this.errorHandler.getDefaultErrorMessage(error.code);
                        }
                    });
        }

    }

}
