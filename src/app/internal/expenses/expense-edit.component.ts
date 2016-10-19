import {Component, OnInit} from '@angular/core';
import {ExpenseService} from "../../services/expense.service";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Expense} from "../../models/expense";

@Component({
    templateUrl: 'expense-edit.component.html'
})
export class ExpenseEditComponent implements OnInit {

    private form: FormGroup;
    private expense: Expense;
    private loading = false;
    private saving = false;

    constructor(private expenseService: ExpenseService, fb: FormBuilder, private route: ActivatedRoute, private router: Router) {

        let id = this.route.snapshot.data['id'];
        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.loading = true;
                this.expenseService.getExpense(id)
                    .subscribe((expense: Expense) => {
                        this.expense = expense;
                        this.loading = false;
                    });
            }
        });

        this.form = fb.group({
            'number': ["", Validators.required],
            'date': ["", Validators.required],
            'description': [""],
        });

    }

    ngOnInit() {
    }

    onSubmit() {
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
