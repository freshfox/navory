import {Component, OnInit, ViewChild, ComponentRef, TemplateRef} from "@angular/core";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../models/customer";
import {TranslateService} from "@ngx-translate/core";
import {CustomerEditComponent} from "./customer-edit.component";
import {TableOptions} from '../../lib/ffc-angular/components/table/table-options.model';
import {SortDirection} from '../../lib/ffc-angular/components/table/sort-direction.enum';
import {DialogService, DialogType} from '@freshfox/ng-core';

@Component({
	selector: 'nvry-customers',
	templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {

	customers: Customer[];
	loading = false;

	@ViewChild('actionsColumn', { static: true }) private actionsColumn: TemplateRef<any>;

	tableOptions: TableOptions;

	constructor(private customerService: CustomerService,
				private translate: TranslateService,
				private dialogService: DialogService) {
	}

	ngOnInit() {
		this.tableOptions = new TableOptions({
			columns: [
				{name: this.translate.instant('general.number-abbrev'), prop: 'number', width: 9},
				{name: this.translate.instant('general.name'), prop: 'name', sortDirection: SortDirection.Asc},
				{name: this.translate.instant('general.email'), prop: 'email', width: 20},
				{name: this.translate.instant('general.phone'), prop: 'phone', width: 15},
				{width: 4, cellTemplate: this.actionsColumn, sortable: false},
			]
		});

		this.loading = true;
		this.customerService.getCustomers()
			.subscribe(
				(customers) => {
					this.customers = customers;
					this.loading = false;
				},
				(error) => {
					// TODO
				});
	}

	createCustomer() {
		this.editCustomer(null);
	}

	editCustomer(customer: Customer) {
		const ref = this.dialogService.create(CustomerEditComponent, {
			parameters: {
				customer: customer
			}
		});

		ref.componentInstance.onSaved.subscribe((savedCustomer: Customer) => {
			let foundCustomer = false;
			this.customers.forEach((customer) => {
				if (savedCustomer.id === customer.id) {
					Object.assign(customer, savedCustomer);
					foundCustomer = true;
				}
			});

			if (!foundCustomer) {
				this.customers.push(savedCustomer);
			}

			this.customers = this.customers.slice();
			ref.close();
		});

		ref.componentInstance.onCancel.subscribe(() => {
			ref.close();
		});
	}

	deleteCustomer(customer: Customer) {
		this.dialogService.createConfirmRequest(
			this.translate.instant('customers.delete-confirm-title'),
			this.translate.instant('customers.delete-confirm-message'),
			null,
			null,
			DialogType.Danger,
		).subscribe((confirmed) => {
			if (confirmed) {
				this.customerService.deleteCustomer(customer).subscribe();
				let index = this.customers.indexOf(customer);
				if (index > -1) {
					this.customers.splice(index, 1);
				}
			}
		});
	}
}
