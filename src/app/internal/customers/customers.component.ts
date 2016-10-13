import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../models/customer";
import {TableOptions} from "angular2-data-table";
import {TranslateService} from "ng2-translate";
import {Helpers} from "../../core/helpers";

@Component({
	template: require('./customers.html')
})
export class CustomersComponent implements OnInit {

	private customers: Customer[];
    private loading = false;

    tableOptions: TableOptions;

	constructor(private customerService: CustomerService, private translate: TranslateService) {

        this.tableOptions = Helpers.getTableOptions({
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

}
