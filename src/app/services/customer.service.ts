import {Injectable} from '@angular/core';
import {Customer} from "../models/customer";
import {Http} from "@angular/http";
import {BaseService} from "./base.service";
import {Observable} from "rxjs";

@Injectable()
export class CustomerService extends BaseService {

	private customersUrl = '/customers';

    constructor(http: Http) {
        super(http);
    }

	getCustomers(): Observable<Customer[]> {
		return this.get(this.customersUrl)
            .map(data => data as Customer[])
	}

}
