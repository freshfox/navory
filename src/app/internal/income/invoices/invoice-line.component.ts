import {Component, OnInit, Input, EventEmitter, Output} from "@angular/core";
import {Line} from "../../../models/invoice-line";
import {Unit} from "../../../models/unit";
import {BootstrapService} from "../../../services/bootstrap.service";
import {TaxRate} from "../../../models/tax-rate";
import {TaxRateService} from "../../../services/tax-rate.service";
import {Config} from "../../../core/config";
import {UnitService} from "../../../services/unit.service";

@Component({
	selector: 'nvry-invoice-line',
	template: `
            <div class="invoice-line__row">
                <ff-input 
                placeholder="Name" 
                [(ngModel)]="invoiceLine.title" 
                class="title-field connected-with-next" 
                (focus)="titleFieldInFocus = true;" (blur)="titleFieldInFocus = false;"></ff-input>
                
                <ff-input 
                type="money" 
                [alwaysShowDecimals]="false"
                [numberOfDecimals]="numberOfQuantityDecimals"
                [(ngModel)]="invoiceLine.quantity" 
                class="quantity-field connected-with-next"></ff-input>
                
                <ff-select 
                [options]="units" 
                [selectedValue]="invoiceLine.unit.id"
                (selectedValueChange)="unitChanged($event)"
                class="unit-field connected-with-next"></ff-select>
                
                <ff-input type="money" [(ngModel)]="invoiceLine.price" class="amount-field connected-with-next"></ff-input>
                
                <ff-select [options]="taxRates" [selectedValue]="invoiceLine.tax_rate.id" (selectedValueChange)="taxRateChanged($event)" class="taxrate-field connected-with-next"></ff-select>
                
                <ff-input type="money" [ngModel]="getAmount()" disabled></ff-input>
                
                <ff-dropdown>
					<button (click)="copyLine()">{{ 'actions.copy' | translate }}</button>
					<button (click)="deleteLine()" *ngIf="deleteShown">{{ 'general.delete' | translate }}</button>
				</ff-dropdown>
            </div>
            
            <ff-textarea 
                [placeholder]="'general.description' | translate"
                [(ngModel)]="invoiceLine.description" class="description-field" 
                [class.description-field--visible]="invoiceLine.description || titleFieldInFocus || descriptionFieldInFocus"
                (focus)="descriptionFieldInFocus = true;" (blur)="descriptionFieldInFocus = false;"></ff-textarea>                            
    `
})
export class InvoiceLineComponent implements OnInit {

	@Input() invoiceLine: Line;
	@Input() deleteShown: boolean = true;
	@Output() onDelete: EventEmitter<Line> = new EventEmitter<Line>();
	@Output() onCopy: EventEmitter<Line> = new EventEmitter<Line>();
	@Input() units: Unit[];
	@Input() taxRates: TaxRate[];
	defaultTaxRate: TaxRate;
	numberOfQuantityDecimals: number = 4;
	amount: number = 0;

	titleFieldInFocus: boolean = false;
	descriptionFieldInFocus: boolean = false;


	constructor(private bootstrapService: BootstrapService, private taxRateService: TaxRateService, private unitService: UnitService) {

	}

	ngOnInit() {
		if (!this.invoiceLine.unit) {
			this.invoiceLine.unit = new Unit({ id: Config.defaultUnitId });
		}

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

	unitChanged(id: number) {
		this.unitService.getUnit(id)
			.subscribe(unit => this.invoiceLine.unit = unit);
	}

	deleteLine() {
		this.onDelete.next(this.invoiceLine);
	}

	copyLine() {
		this.onCopy.next(this.invoiceLine);
	}

}
