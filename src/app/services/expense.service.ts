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

    getIncomes(): Observable<Expense[]> {
        return this.get(this.pathExpenses);
    }

}

