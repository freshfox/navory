import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../models/customer";
import {TranslateService} from "ng2-translate";
import {TableOptions} from "../../core/components/table/table-options.model";

@Component({
	templateUrl: 'customers.html'
})
export class CustomersComponent implements OnInit {

	private customers: Customer[];
    private loading = false;

    tableOptions: TableOptions;

	constructor(private customerService: CustomerService, private translate: TranslateService) {

        this.tableOptions = new TableOptions({
            columns: [
                { name: this.translate.instant('general.number-abbrev'),  prop: 'number' },
                { name: this.translate.instant('general.name'), prop: 'name' },
                { name: this.translate.instant('general.email'), prop: 'email' },
                { name: this.translate.instant('general.phone'), prop: 'phone' }
            ]
        });
	}

	ngOnInit() {
        this.loading = true;
        this.customerService.getCustomers()
            .subscribe((customers) => {
                    this.customers = customers;
                    this.loading = false;
                },
                (error) => {

                });
    }

	createCustomer() {
        // TODO
	}

    editCustomer(customer) {
        // TODO
    }

}
