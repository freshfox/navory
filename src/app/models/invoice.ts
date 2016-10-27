import {InvoiceLine} from "./invoice-line";

export class Invoice {

    id: number;
    date: string;
    due_date: string;
    invoice_lines: InvoiceLine[];
    payment_date: string;

}

export enum InvoiceStatus {
    Draft = 'draft' as any,
    Issued = 'issued' as any,
    PartyPaid = 'partly-paid' as any,
    Paid = 'paid' as any,
    Overdue = 'overdue' as any
}

