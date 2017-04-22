import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class SubscriptionService extends BaseService {

	private pathToken = '/payment/token';
	private pathSubscribe = '/payment/subscribe';

	constructor(http: Http) {
		super(http);
	}

	getPaymentToken(): Observable<string> {
		return this.get(this.pathToken)
			.map(data => {
				return data.token
			});
	}

	activateSubscription(planId: string, nonce: string): Observable<any> {
		return this.getPaymentToken();

		/*return this.post(this.pathSubscribe, {
			payment_method_nonce: nonce,
			pland_id: planId
		});*/
	}


}
