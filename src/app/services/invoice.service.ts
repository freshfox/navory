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
        return this.get(this.getRestEntityPath(this.pathInvoices, id))
            .map(invoice => {
                return new Invoice(invoice);
            });
    }

    saveInvoice(invoice: Invoice) {
        if(invoice.id) {
            return this.patch(this.getRestEntityPath(this.pathInvoices, invoice.id), invoice);
        }
        return this.post(this.pathInvoices, invoice);
    }

    getTaxAmounts(invoice: Invoice): any[] {
        var amounts = [];
        invoice.invoice_lines.forEach((line) => {
            var rate = line.getTaxrate();
            var taxAmount = line.getTaxAmount();
            var netAmount = line.getNetAmount();

            if(rate !== 0 && netAmount !== 0) {
                var amount = amounts.find(amount => {
                    return amount.rate == rate;
                });

                if(!amount) {
                    amount = {
                        rate: rate,
                        amount: 0,
                        netAmount: 0
                    };
                    amounts.push(amount);
                }


                amount.amount += taxAmount;
                amount.netAmount += netAmount;
            }
        });


        return amounts;
    }

}

