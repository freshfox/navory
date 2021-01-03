import {Injectable} from "@angular/core";
import {Customer} from "../models/customer";
import {Http} from "@angular/http";
import {NavoryApi} from "./base.service";
import {Observable} from "rxjs";
import {AnalyticsEventType, AnalyticsService} from "./analytics.service";
import {map} from 'rxjs/operators';

@Injectable()
export class CustomerService extends NavoryApi {

	private pathCustomers = '/customers';

	constructor(http: Http) {
		super(http);
	}

	searchCustomers(query: string): Observable<Customer[]> {
		return this.getCustomers()
			.pipe(map(customers => {
				return customers.filter(customer => {
					return customer.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
				});
			}));
	}

	getCustomer(id: string): Observable<Customer> {
		return this.get(this.getRestEntityPath(this.pathCustomers, id));
	}

	getCustomers(): Observable<Customer[]> {
		return this.get(this.pathCustomers)
			.pipe(map(data => data as Customer[]));
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
		return this.post(this.pathCustomers, customer)
			.pipe(map(data => {
				return new Customer(data);
			}));
	}

	private updateCustomer(customer: Customer) {
		let path = this.pathCustomers + `/${customer.id}`;
		return this.patch(path, customer)
			.pipe(map(data => {
				return new Customer(data);
			}));
	}

}
