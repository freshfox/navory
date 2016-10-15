import {BaseService} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Income} from "../models/income";
import {Http} from "@angular/http";

@Injectable()
export class IncomeService extends BaseService {

    private pathIncome = '/incomes';

    constructor(http: Http) {
        super(http);
    }

    getIncomes(): Observable<Income[]> {
        return this.get(this.pathIncome);
    }

}

