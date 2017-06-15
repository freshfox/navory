import {AfterViewInit, Component, ComponentRef, ElementRef, Input, ViewChild} from "@angular/core";
import {BaseInvoice} from "../../models/invoice-base.model";
import {ModalService} from "../ffc-angular/services/modal.service";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../models/customer";
import {CustomerEditComponent} from "../../internal/customers/customer-edit.component";
import {BootstrapService} from "../../services/bootstrap.service";
import {Country} from "../../models/country";
const AutoComplete = require('javascript-autocomplete');

@Component({
	selector: 'nvry-invoice-edit-customer',
	template: `
		<div #customerName class="invoice-edit-customer-name-wrapper">

			<div class="invoice-edit-customer-link-wrapper">
				<ng-template [ngIf]="invoice.customer">
					<a class="invoice-edit-customer-link"
					   href="javascript:void(0)"
					   (click)="editCustomer()">
						{{ 'invoices.edit-customer' | translate }}
					</a>

					<div class="invoice-edit-customer-link-button-wrapper">
						<button class="button ff-button--mini-rounded"
								[mdTooltip]="'invoices.remove-customer-link' | translate"
								(click)="removeCustomerLink()">
							<ff-icon name="cross"></ff-icon>
						</button>
					</div>
				</ng-template>

				<ng-template [ngIf]="invoice.customer_name && !invoice.customer">
					<a href="javascript:void(0)" class="invoice-edit-customer-link" (click)="saveCustomer()">
						{{ 'invoices.save-customer' | translate }}
					</a>
				</ng-template>
			</div>

			<ff-input [label]="'general.customer' | translate"
					  [(ngModel)]="invoice.customer_name"></ff-input>
		</div>

		<ff-textarea [label]="'general.address' | translate"
					 [(ngModel)]="invoice.customer_address"></ff-textarea>

		<ff-select [label]="'general.country' | translate" [options]="countries" valueKey="code"
				   [(selectedValue)]="invoice.customer_country_code"></ff-select>`,
	host: {
		'class': 'bit-50 customer-area'
	}
})
export class InvoiceEditCustomerComponent implements AfterViewInit {


	countries: Country[];

	@Input() invoice: BaseInvoice;
	@ViewChild('customerName') private customerName: ElementRef;

	constructor(private modalService: ModalService, private customerService: CustomerService, private bootstrapService: BootstrapService) {
	}

	ngOnInit() {
		this.countries = this.bootstrapService.getCountries();
	}

	ngAfterViewInit() {
		this.initCustomerAutocomplete();
	}

	initCustomerAutocomplete() {
		let autocomplete = new AutoComplete({
			selector: this.customerName.nativeElement.querySelector('input'),
			delay: 50,
			minChars: 2,
			source: (term, response) => {
				this.customerService.searchCustomers(term)
					.subscribe(response);
			},
			renderItem: function (customer, search) {
				search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
				let re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
				return `<div class="autocomplete-suggestion" data-val="${customer.name}" data-id="${customer.id}">${customer.name.replace(re, "<b>$1</b>")}</div>`;
			},
			onSelect: (event, value, item) => {
				let id = item.dataset.id;
				this.customerService.getCustomer(id)
					.subscribe(customer => {
						this.updateCustomer(customer);
					});
			}
		});
	}

	private updateCustomer(customer: Customer) {
		this.invoice.customer = customer;
		this.invoice.customer_name = customer.name;
		this.invoice.customer_address = customer.address;
		this.invoice.customer_vat_number = customer.vat_number;
		this.invoice.customer_country_code = customer.country_code;
	}

	private removeCustomerLink() {
		this.invoice.customer = null;
	}

	private editCustomer() {
		this.modalService.create(CustomerEditComponent, {
			parameters: {
				customer: this.invoice.customer
			}
		}).subscribe((ref: ComponentRef<CustomerEditComponent>) => {
			ref.instance.onSaved.subscribe((savedCustomer: Customer) => {
				this.updateCustomer(savedCustomer);
				this.modalService.hideCurrentModal();
			});

			ref.instance.onCancel.subscribe(() => {
				this.modalService.hideCurrentModal();
			});
		});
	}

	saveCustomer() {
		let customer = new Customer();
		customer.name = this.invoice.customer_name;
		customer.address = this.invoice.customer_address;
		customer.country_code = this.invoice.customer_country_code;

		this.modalService.create(CustomerEditComponent, {
			parameters: {
				customer: customer
			}
		}).subscribe((ref: ComponentRef<CustomerEditComponent>) => {
			ref.instance.onSaved.subscribe((savedCustomer: Customer) => {
				this.updateCustomer(savedCustomer);
				this.modalService.hideCurrentModal();
			});

			ref.instance.onCancel.subscribe(() => {
				this.modalService.hideCurrentModal();
			});
		});
	}
}
