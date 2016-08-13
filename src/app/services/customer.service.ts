import {Injectable} from '@angular/core';
import {Customer} from "../models/customer";
import {Http} from "@angular/http";
import {BaseService} from "./base.service";

@Injectable()
export class CustomerService extends BaseService {

	private customersUrl = '/customers';

    constructor(http: Http) {
        super(http);
    }

	getCustomers(): Promise<Customer[]> {
		return this.get(this.customersUrl)
            .then(data => data as Customer[])
	}

}
