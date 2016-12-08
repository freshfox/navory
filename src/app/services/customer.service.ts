import {Injectable} from "@angular/core";
import {Customer} from "../models/customer";
import {Http} from "@angular/http";
import {BaseService} from "./base.service";
import {Observable} from "rxjs";

@Injectable()
export class CustomerService extends BaseService {

	private pathCustomers = '/customers';

	constructor(http: Http) {
		super(http);
	}

	getCustomers(): Observable<Customer[]> {
		return this.get(this.pathCustomers)
			.map(data => data as Customer[])
	}

	saveCustomer(customer: Customer): Observable<Customer> {
		if (customer.id) {
			return this.updateCustomer(customer);
		}
		return this.createCustomer(customer);
	}

	deleteCustomer(customer: Customer): Observable<any> {
		return this.delete(this.getRestEntityPath(this.pathCustomers, customer.id));
	}

	private createCustomer(customer: Customer) {
		return this.post(this.pathCustomers, customer);
	}

	private updateCustomer(customer: Customer) {
		let path = this.pathCustomers + `/${customer.id}`;
		return this.patch(path, customer);
	}

}
