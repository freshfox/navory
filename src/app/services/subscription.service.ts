import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class SubscriptionService extends BaseService {

	private pathToken = '/payment/token';

	constructor(http: Http) {
		super(http);
	}

	getPaymentToken(): Observable<string> {
		return this.get(this.pathToken)
			.map(data => {
				return data.token
			});
	}

	/*activateSubscription(): Observable<any> {

	}*/


}
