import {BaseService} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {Expense} from "../models/expense";

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

}

