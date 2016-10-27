import {BaseService} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {Invoice} from "../models/invoice";
import {InvoiceLine} from "../models/invoice-line";

@Injectable()
export class InvoiceService extends BaseService {

    private pathInvoices = '/invoices';

    constructor(http: Http) {
        super(http);
    }

    getInvoices(): Observable<Invoice[]> {
        return this.get(this.pathInvoices);
    }

    getInvoice(id: number): Observable<Invoice> {
        return this.get(this.getRestEntityPath(this.pathInvoices, id));
    }

    saveInvoice(invoice: Invoice) {
        if(invoice.id) {
            return this.patch(this.getRestEntityPath(this.pathInvoices, invoice.id), invoice);
        }
        return this.post(this.pathInvoices, invoice);
    }

    getTaxAmounts(invoice: Invoice) {
        var amounts = {};
        invoice.invoice_lines.forEach((line) => {
            line = new InvoiceLine(line);
            var rate = line.getTaxrate();
            var taxAmount = line.getTaxAmount();
            var netAmount = line.getNetAmount();

            if(rate !== 0 && netAmount !== 0) {
                if(!amounts[rate]) {
                    var data = {
                        amount: 0,
                        netAmount: 0
                    };
                    amounts[rate] = data;
                }
                amounts[rate].amount += taxAmount;
                amounts[rate].netAmount += netAmount;
            }
        });

        return amounts;
    }

}

