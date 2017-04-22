import {Component, OnInit, ViewChild, ComponentRef, TemplateRef} from "@angular/core";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../models/customer";
import {TranslateService} from "@ngx-translate/core";
import {TableOptions} from "../../core/components/table/table-options.model";
import {SortDirection} from "../../core/components/table/sort-direction.enum";
import {ModalService} from "../../core/modal.module";
import {CustomerEditComponent} from "./customer-edit.component";

@Component({
	selector: 'nvry-customers',
	templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {

	customers: Customer[];
	loading = false;

	@ViewChild('actionsColumn') private actionsColumn: TemplateRef<any>;

	tableOptions: TableOptions;

	constructor(private customerService: CustomerService,
				private translate: TranslateService,
				private modalService: ModalService) {
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
		this.modalService.create(CustomerEditComponent, {
			customer: customer
		}).subscribe((ref: ComponentRef<CustomerEditComponent>) => {
			ref.instance.onSaved.subscribe((savedCustomer: Customer) => {
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
				this.modalService.hideCurrentModal();
			});

			ref.instance.onCancel.subscribe(() => {
				this.modalService.hideCurrentModal();
			});
		});
	}

	deleteCustomer(customer: Customer) {
		this.modalService.createConfirmRequest(
			this.translate.instant('customers.delete-confirm-title'),
			this.translate.instant('customers.delete-confirm-message'),
			() => {
				this.modalService.hideCurrentModal();
			},
			() => {
				this.customerService.deleteCustomer(customer).subscribe();
				let index = this.customers.indexOf(customer);
				if (index > -1) {
					this.customers.splice(index, 1);
				}
				this.modalService.hideCurrentModal();
			}
		);
	}
}
