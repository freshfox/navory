import {Component} from '@angular/core';
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../models/customer";

@Component({
	template: require('./customers.html')
})
export class CustomersComponent {

	private customers: Customer[];
    private isLoading = false;

	constructor(private customerService: CustomerService) {
        this.isLoading = true;

        this.customerService.getCustomers()
            .subscribe((customers) => {
                this.customers = customers;
                this.isLoading = false;
            },
                (error) => {

                });
	}

}
