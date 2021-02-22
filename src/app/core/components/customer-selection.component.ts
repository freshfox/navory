import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CustomerService} from '../../services/customer.service';
import {Customer} from '../../models/customer';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
	selector: 'nvry-customer-selection',
	template: `
		<div class="ff-input" *ngIf="!customer">
			<label>{{ 'general.customer' | translate }}</label>
			<input type="text" class="ff-input" [matAutocomplete]="auto" [formControl]="control">
		</div>

		<div *ngIf="customer">
			<label>{{ 'general.customer' | translate }}</label>
			<div class="flex items-center">
				<span style="font-size: 16px; font-weight: bold;">{{ customer.name }}</span>
				<button class="button ff-button--mini-rounded" class="w-8 h-8"
						[matTooltip]="'invoices.remove-customer-link' | translate"
						(click)="removeCustomer()">
					<mat-icon>close</mat-icon>
				</button>
			</div>
		</div>

		<mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" (optionSelected)="customerSelected($event)">
			<mat-option *ngFor="let option of filteredOptions | async" [value]="option">{{ option.name }}</mat-option>
		</mat-autocomplete>`
})
export class CustomerSelectionComponent {

	@Input() customer: Customer = null;
	@Output() customerChange = new EventEmitter<Customer>();

	customers: Customer[];
	control = new FormControl();
	filteredOptions: Observable<Customer[]>;

	constructor(private customerService: CustomerService) {
	}

	ngOnInit() {
		this.customerService.getCustomers()
			.subscribe(customers => this.customers = customers);

		this.filteredOptions = this.control.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filter(value))
			);
	}

	removeCustomer() {
		this.selectCustomer(null);
		this.control.setValue(null);
	}

	customerSelected(event: MatAutocompleteSelectedEvent) {
		const customer: Customer = event.option.value;
		this.selectCustomer(customer);
	}

	selectCustomer(customer: Customer) {
		this.customer = customer;
		this.customerChange.next(this.customer);
	}

	displayFn(customer?: Customer): string | undefined {
		return customer ? customer.name : undefined;
	}

	private _filter(value: string): Customer[] {
		if (!this.customers || !value || typeof value !== 'string') {
			return [];
		}

		const filterValue = value.toLowerCase();

		return this.customers.filter(option => option.name.toLowerCase().includes(filterValue));
	}
}
