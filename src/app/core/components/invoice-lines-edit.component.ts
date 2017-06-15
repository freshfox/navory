import {Component, Input} from "@angular/core";
import {InvoiceLine} from "../../models/invoice-line";

@Component({
	selector: 'nvry-invoice-lines-edit',
	template: `
		<div class="invoice-edit-paper-section lines">
			<div class="invoice-lines-container">
				<div class="header">
					<span class="title-header">{{ 'general.product' | translate }}</span>
					<span class="quantity-header">{{ 'general.quantity' | translate }}</span>
					<span class="unit-header">{{ 'general.unit' | translate }}</span>
					<span class="price-header">{{ 'general.price-net' | translate }}</span>
					<span class="taxrate-header">{{ 'general.vat-abbr' | translate }}</span>
					<span class="amount-header">{{ 'general.amount_net' | translate }}</span>
				</div>

				<div>
					<nvry-invoice-line [invoiceLine]="line"
									   [deleteShown]="invoiceLines.length > 1"
									   *ngFor="let line of invoiceLines"
									   (onDelete)="deleteLine($event)" (onCopy)="copyLine($event)"></nvry-invoice-line>
				</div>
			</div>

			<button ff-button class="ff-button--secondary" (click)="addLine()">{{ 'invoices.new-line' | translate }}
			</button>
		</div>`,
})
export class InvoiceLinesEditComponent {

	@Input() invoiceLines: InvoiceLine[];

	addLine() {
		let lastLine = this.invoiceLines[this.invoiceLines.length - 1];
		let lastTaxRate = lastLine.tax_rate;
		this.invoiceLines.push(new InvoiceLine({ tax_rate: lastTaxRate }));
	}

	deleteLine(invoiceLine) {
		this.invoiceLines = this.invoiceLines.filter((line) => {
			return line !== invoiceLine;
		});
	}

	copyLine(invoiceLine) {
		let index = this.invoiceLines.indexOf(invoiceLine);
		let lineCopy = new InvoiceLine(invoiceLine);

		this.invoiceLines.splice(index, 0, lineCopy);
	}
}
