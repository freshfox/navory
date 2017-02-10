import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Payment} from "../models/payment";

@Injectable()
export class PaymentService extends BaseService {

	private pathPayments = '/payments';

	constructor(http: Http) {
		super(http);
	}

	getPayments(): Observable<Payment[]> {
		return this.get(this.pathPayments);
	}

	deletePayment(payment: Payment) {
		return this.delete(`${this.pathPayments}/${payment.id}`);
	}
}
