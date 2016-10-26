import {BaseService} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {Expense} from "../models/expense";
import {EuVatType} from "../core/enums/eu-vat-type.enum";

@Injectable()
export class ExpenseService extends BaseService {

    private pathExpenses = '/expenses';

    constructor(http: Http) {
        super(http);
    }

    getExpenses(): Observable<Expense[]> {
        return this.get(this.pathExpenses);
    }

    getExpense(id: number): Observable<Expense> {
        let path = this.pathExpenses + `/${id}`;
        return this.get(path);
    }

    saveExpense(expense: Expense): Observable<Expense> {
        if(expense.eu_vat_type == EuVatType.None) {
            expense.eu_vat_type = null;
        }

        if(!expense.id) {
            return this.post(this.pathExpenses, expense);
        }

        let path = this.pathExpenses + `/${expense.id}`;
        return this.patch(path, expense);
    }

}

