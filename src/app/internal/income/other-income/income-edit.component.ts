import {Component, OnInit} from '@angular/core';
import {IncomeService} from "../../../services/income.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {TaxRateService} from "../../../services/tax-rate.service";
import {State} from "../../../core/state";
import {Income} from "../../../models/income";
import {FormValidator} from "../../../core/form-validator";
import {Helpers} from "../../../core/helpers";
import {ErrorHandler} from "../../../core/error-handler";
import {TaxRate} from "../../../models/tax-rate";
import {BootstrapService} from "../../../services/bootstrap.service";
import {EuVatType} from "../../../core/enums/eu-vat-type.enum";
import {ServiceError, FieldValidationError} from "../../../services/base.service";

@Component({
    selector: 'nvry-income-edit',
    templateUrl: './income-edit.component.html'
})
export class IncomeEditComponent implements OnInit {

    private loading: boolean = false;
    private saving: boolean = false;
    private form: FormGroup;
    private alertMessage: string;
    private nextIncomeNumber: number;

    private euVatTypes: any;
    private taxRates: TaxRate[];
    private income: Income;


    constructor(private incomeService: IncomeService,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private taxRateService: TaxRateService,
                private state: State,
                private errorHandler: ErrorHandler,
                private bootstrapService: BootstrapService) {

        this.income = new Income();
        this.nextIncomeNumber = this.state.nextIncomeNumber;

        this.taxRateService.getDefaultTaxRate()
            .subscribe(rate => {
                if(!this.income.tax_rate) {
                    this.income.tax_rate = rate;
                }
            });

        this.taxRateService.getFormattedTaxRates()
            .subscribe(taxRates => this.taxRates = taxRates);

        this.euVatTypes = this.bootstrapService.getFormattedEuVatTypes();

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

    ngOnInit() { }

    taxRateChanged(id: number) {
        this.taxRateService.getTaxRate(id)
            .subscribe(rate => {
                if(rate.rate !== 0) {
                    this.income.eu_vat_type = EuVatType.None;
                }
                this.income.tax_rate = rate;
            });
    }

    save() {
        Helpers.validateAllFields(this.form);
        if(this.form.valid) {
            this.saving = true;
            this.incomeService.saveIncome(this.income)
                .subscribe(
                    (income) => {
                        let isNew = !this.income.id;
                        if(isNew) {
                            this.state.nextIncomeNumber++;
                        }
                        this.income = income;
                        this.saving = false;
                        this.router.navigate(['/income']);
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
