import {BaseService} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {Invoice} from "../models/invoice";
import {FileService} from "./file.service";

@Injectable()
export class InvoiceService extends BaseService {

    private pathInvoices = '/invoices';

    constructor(http: Http, private fileService: FileService) {
        super(http);
    }

    getInvoices(): Observable<Invoice[]> {
        return this.get(this.pathInvoices);
    }

    getInvoice(id: number): Observable<Invoice> {
        return this.get(this.getRestEntityPath(this.pathInvoices, id))
            .map(invoiceData => {
                let invoice = new Invoice(invoiceData);
                return invoice;
            });
    }

    saveInvoice(invoice: Invoice) {
        if (invoice.id) {
            return this.patch(this.getRestEntityPath(this.pathInvoices, invoice.id), invoice)
                .map(invoice => new Invoice(invoice));
        }
        return this.post(this.pathInvoices, invoice)
            .map(invoice => new Invoice(invoice));
    }

    getTaxAmounts(invoice: Invoice): any[] {
        var amounts = [];
        invoice.invoice_lines.forEach((line) => {
            var rate = line.getTaxrate();
            var taxAmount = line.getTaxAmount();
            var netAmount = line.getNetAmount();

            if (rate !== 0 && netAmount !== 0) {
                var amount = amounts.find(amount => {
                    return amount.rate == rate;
                });

                if (!amount) {
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

        amounts.sort((a, b) => {
            return a.rate > b.rate ? 1 : -1;
        });

        return amounts;
    }

    getPreviewURL(invoice: Invoice): string {
        return this.constructApiUrl(`${this.pathInvoices}/${invoice.id}/html`);
    }

    getDownloadURL(invoice: Invoice): string {
        return this.constructApiUrl(`${this.pathInvoices}/${invoice.id}/pdf`);
    }

    downloadInvoicePDF(invoice: Invoice) {
        let url = this.getDownloadURL(invoice);
        this.fileService.downloadFromURL(url);
    }

}

