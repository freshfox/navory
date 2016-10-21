import {Component, OnInit, ViewChild} from '@angular/core';
import {ExpenseService} from "../../services/expense.service";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Expense} from "../../models/expense";
import {TaxRate} from "../../models/tax-rate";
import {State} from "../../core/state";
import {ModalComponent} from "../../core/components/modal.component";
import {Category} from "../../models/category";
import {FormValidator} from "../../core/form-validator";

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

    @ViewChild('selectCategory') private selectCategoryModal: ModalComponent;


    constructor(private expenseService: ExpenseService,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private state: State) {

        this.expense = new Expense();
        this.expenseCategories = this.state.expenseCategories;

        this.taxRates = this.state.taxRates.map((taxRate) => {
            return {
                name: taxRate.rate + '%',
                value: taxRate.id
            }
        });

        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.loading = true;
                this.expenseService.getExpense(id)
                    .subscribe((expense: Expense) => {
                        this.expense = expense;
                        this.initForm(this.expense);
                        this.loading = false;
                    });
            }
        });

        this.initForm(this.expense);
    }

    ngOnInit() {
    }

    initForm(expense: Expense) {
        this.form = this.fb.group({
            number: [expense.number, Validators.required],
            //date: [expense.date, Validators.required, FormValidator.date],
            description: [expense.description],
            price: [expense.price, Validators.required],
        });
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
            this.expenseService.createOrEditExpense(this.expense)
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
