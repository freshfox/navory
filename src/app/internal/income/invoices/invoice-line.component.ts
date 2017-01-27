import {Component, OnInit, Input, EventEmitter, Output} from "@angular/core";
import {InvoiceLine} from "../../../models/invoice-line";
import {Unit} from "../../../models/unit";
import {BootstrapService} from "../../../services/bootstrap.service";
import {TaxRate} from "../../../models/tax-rate";
import {TaxRateService} from "../../../services/tax-rate.service";
import {Config} from "../../../core/config";

@Component({
	selector: 'nvry-invoice-line',
	template: `
            <div class="invoice-line__row">
                <nvry-input 
                placeholder="Name" 
                [(ngModel)]="invoiceLine.title" 
                class="title-field connected-with-next" 
                (focus)="titleFieldInFocus = true;" (blur)="titleFieldInFocus = false;"></nvry-input>
                
                <nvry-input 
                type="money" 
                [alwaysShowDecimals]="false"
                [numberOfDecimals]="numberOfQuantityDecimals"
                [(ngModel)]="invoiceLine.quantity" 
                class="quantity-field connected-with-next"></nvry-input>
                
                <nvry-select 
                [options]="units" 
                [(selectedValue)]="invoiceLine.unit_id" 
                class="unit-field connected-with-next"></nvry-select>
                
                <nvry-input type="money" [(ngModel)]="invoiceLine.price" class="amount-field connected-with-next"></nvry-input>
                
                <nvry-select [options]="taxRates" [selectedValue]="invoiceLine.tax_rate.id" (selectedValueChange)="taxRateChanged($event)" class="taxrate-field connected-with-next"></nvry-select>
                
                <nvry-input type="money" [ngModel]="getAmount()" disabled></nvry-input>
                
                <nvry-dropdown *ngIf="dropdownShown">
                    <button (click)="deleteLine()">{{ 'general.delete' | translate }}</button>
                </nvry-dropdown>
            </div>
            
            <nvry-textarea 
                [placeholder]="'general.description' | translate"
                [(ngModel)]="invoiceLine.description" class="description-field" 
                [class.description-field--visible]="invoiceLine.description || titleFieldInFocus || descriptionFieldInFocus"
                (focus)="descriptionFieldInFocus = true;" (blur)="descriptionFieldInFocus = false;"></nvry-textarea>                            
    `
})
export class InvoiceLineComponent implements OnInit {

	@Input() invoiceLine: InvoiceLine;
	@Input() dropdownShown: boolean = true;
	@Output() onDelete: EventEmitter<InvoiceLine> = new EventEmitter<InvoiceLine>();
	private units: Unit[];
	private taxRates: TaxRate[];
	private defaultTaxRate: TaxRate;
	private numberOfQuantityDecimals: number = 4;
	private amount: number = 0;

	private titleFieldInFocus: boolean = false;
	private descriptionFieldInFocus: boolean = false;


	constructor(private bootstrapService: BootstrapService, private taxRateService: TaxRateService) {

	}

	ngOnInit() {
		if (!this.invoiceLine.unit_id) {
			this.invoiceLine.unit_id = Config.defaultUnitId;
		}
		this.bootstrapService.getUnits()
			.subscribe(units => this.units = units);

		this.taxRateService.getFormattedTaxRates()
			.subscribe(taxRates => this.taxRates = taxRates);

		this.taxRateService.getDefaultTaxRate()
			.subscribe(rate => {
				this.defaultTaxRate = rate;
				if (!this.invoiceLine.tax_rate) {
					this.invoiceLine.tax_rate = this.defaultTaxRate;
				}
			});
	}

	getAmount(): number {
		return this.invoiceLine.getNetAmount();
	}

	taxRateChanged(id: number) {
		this.taxRateService.getTaxRate(id)
			.subscribe(rate => this.invoiceLine.tax_rate = rate);
	}

	deleteLine() {
		this.onDelete.next(this.invoiceLine);
	}

}
