import {Component} from '@angular/core';
import {CustomersService} from "../../services/customers.service";
import {Customer} from "../../models/customer";

@Component({
	template: require('./customers.html'),
	providers: [CustomersService]
})
export class CustomersComponent {

	customers: Customer[];

	constructor(private customersService: CustomersService) {

	}

}
