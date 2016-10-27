import {BaseService} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {Invoice} from "../models/invoice";

@Injectable()
export class InvoiceService extends BaseService {

    private pathInvoices = '/invoices';

    constructor(http: Http) {
        super(http);
    }

    getInvoices(): Observable<Invoice[]> {
        return this.get(this.pathInvoices);
    }

}

