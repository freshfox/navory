import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Line} from "../../models/invoice-line";
import {BootstrapService} from "../../services/bootstrap.service";
import {TaxRateService} from "../../services/tax-rate.service";
import {TaxRate} from "../../models/tax-rate";
import {Unit} from "../../models/unit";

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
									   [units]="units"
									   [taxRates]="taxRates"
									   [deleteShown]="lines.length > 1"
									   *ngFor="let line of lines"
									   (onDelete)="deleteLine($event)" (onCopy)="copyLine($event)"></nvry-invoice-line>
				</div>
			</div>

			<button ff-button class="ff-button--secondary" (click)="addLine()">{{ 'invoices.new-line' | translate }}
			</button>
		</div>`,
})
export class InvoiceLinesEditComponent {

	@Input() lines: Line[];
	@Output() linesChange: EventEmitter<Line[]> = new EventEmitter<Line[]>();
	units: Unit[];
	taxRates: TaxRate[];

	constructor(private bootstrapService: BootstrapService, private taxRateService: TaxRateService) {}

	ngOnInit() {
		this.bootstrapService.getUnits()
			.subscribe(units => this.units = units);

		this.taxRateService.getFormattedTaxRates()
			.subscribe(taxRates => this.taxRates = taxRates);
	}

	addLine() {
		let lastLine = this.lines[this.lines.length - 1];
		let lastTaxRate = lastLine.tax_rate;
		this.lines.push(new Line({ tax_rate: lastTaxRate }));
	}

	deleteLine(invoiceLine) {
		this.lines = this.lines.filter((line) => {
			return line !== invoiceLine;
		});
	}

	copyLine(invoiceLine) {
		let index = this.lines.indexOf(invoiceLine);
		let lineCopy = new Line(invoiceLine);

		this.lines.splice(index, 0, lineCopy);
	}
}
