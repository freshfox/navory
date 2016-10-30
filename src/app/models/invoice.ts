import {InvoiceLine} from "./invoice-line";
import {BaseModel} from "../core/base.model";

export class Invoice extends BaseModel {

    id: number;
    number: string;
    date: string;
    due_date: string;
    invoice_lines: InvoiceLine[] = [];
    payment_date: string;
    customer_name: string;
    customer_address: string;

    constructor(data?: any) {
        super(data);

        var lines = [];
        this.invoice_lines.forEach(currentLine => {
            var newLine = new InvoiceLine(currentLine);
            lines.push(newLine);
        });
        this.invoice_lines = lines;
    }

    getTotalNet(): number {
        var amount = 0;
        this.invoice_lines.forEach(invoiceLine => {
            amount += invoiceLine.getNetAmount();
        });

        return amount;
    }

    getTotalGross(): number {
        var amount = 0;
        this.invoice_lines.forEach(invoiceLine => {
            amount += invoiceLine.getGrossAmount();
        });

        return amount;
    }
}

export enum InvoiceStatus {
    Draft = 'draft' as any,
    Issued = 'issued' as any,
    PartyPaid = 'partly-paid' as any,
    Paid = 'paid' as any,
    Overdue = 'overdue' as any
}

