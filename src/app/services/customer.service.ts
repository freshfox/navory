import {Injectable} from '@angular/core';
import {Customer} from '../models/customer';
import {ApiService} from '@freshfox/ng-core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class CustomerService {

	private pathCustomers = '/customers';

	constructor(private apiService: ApiService) {

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
		return this.apiService.get(this.apiService.getRestEntityPath(this.pathCustomers, id));
	}

	getCustomers(): Observable<Customer[]> {
		return this.apiService.get(this.pathCustomers)
			.pipe(map(data => data as Customer[]));
	}

	saveCustomer(customer: Customer): Observable<Customer> {
		if (customer.id) {
			return this.updateCustomer(customer);
		}
		return this.createCustomer(customer);
	}

	deleteCustomer(customer: Customer): Observable<any> {
		return this.apiService.delete(this.apiService.getRestEntityPath(this.pathCustomers, customer.id));
	}

	private createCustomer(customer: Customer) {
		return this.apiService.post(this.pathCustomers, customer)
			.pipe(map(data => {
				return new Customer(data);
			}));
	}

	private updateCustomer(customer: Customer) {
		let path = this.pathCustomers + `/${customer.id}`;
		return this.apiService.patch(path, customer)
			.pipe(map(data => {
				return new Customer(data);
			}));
	}

}
