import {Component, OnInit, Input} from '@angular/core';
import {InvoiceLine} from "../../../models/invoice-line";

@Component({
    selector: 'nvry-invoice-line',
    template: `
           <nvry-input placeholder="Name" [(ngModel)]="invoiceLine.title" class="connected-with-next"></nvry-input>
           <nvry-input [(ngModel)]="invoiceLine.quantity" class="connected-with-next"></nvry-input>
        
    `
})
export class InvoiceLineComponent implements OnInit {

    @Input() invoiceLine: InvoiceLine;

    constructor() { }

    ngOnInit() { }

}
