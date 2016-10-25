import {Component, OnInit, ViewChild} from '@angular/core';
import {ExpenseService} from "../../services/expense.service";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Expense, EuVatType} from "../../models/expense";
import {TaxRate} from "../../models/tax-rate";
import {State} from "../../core/state";
import {ModalComponent} from "../../core/components/modal.component";
import {Category} from "../../models/category";
import {FormValidator} from "../../core/form-validator";
import {TranslateService} from "ng2-translate";

@Component({
    templateUrl: 'expense-edit.component.html'
})
export class ExpenseEditComponent implements OnInit {

    private form: FormGroup;
    private expense: Expense;
    private loading = false;
    private saving = false;

    private taxRates;
    private expenseCategories: Category[];

    private euVatTypes: any[];

    @ViewChild('selectCategory') private selectCategoryModal: ModalComponent;


    constructor(private expenseService: ExpenseService,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private state: State,
                private translate: TranslateService) {

        this.expense = new Expense();
        this.expenseCategories = this.state.expenseCategories;

        this.taxRates = this.state.taxRates.map((taxRate) => {
            taxRate['name'] = taxRate.rate + '%';
            return taxRate;
        });

        this.euVatTypes = [
            {
                name: this.translate.instant('income.edit.intra-community-none'),
                value: EuVatType.None
            },
            {
                name: this.translate.instant('income.edit.intra-community-service'),
                value: EuVatType.ReverseCharge
            },
            {
                name: this.translate.instant('income.edit.intra-community-product'),
                value: EuVatType.IntraCommunityAcquisition
            }
        ];

        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.loading = true;
                this.expenseService.getExpense(id)
                    .subscribe((expense: Expense) => {
                        this.expense = expense;
                        console.log(expense);
                        this.loading = false;
                    });
            } else {
                this.loading = false;
            }
        });

        this.form = this.fb.group({
            number: ["", Validators.required],
            date: ["", Validators.required, FormValidator.date],
            description: [""],
            price: ["", Validators.required],
        });
    }

    ngOnInit() {
    }

    showCategories() {
        this.selectCategoryModal.show();
    }

    categorySelected(category: Category) {
        this.selectCategoryModal.hide();
        this.expense.category = category;
    }

    save() {
        if(this.form.valid) {
            this.saving = true;
            this.expenseService.saveExpense(this.expense)
                .subscribe(
                    (expense) => {
                        this.expense = expense;
                        this.saving = false;
                        this.router.navigate(['/expenses']);
                    },
                    (error) => {
                        this.saving = false;
                        // TODO
                    });
        }

    }

}
