import {ComponentRef, Injectable} from "@angular/core";
import {NavoryApi} from "./base.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Subscription} from "../models/subscription";
import {Invoice} from "../models/invoice";
import {State} from "../core/state";
import {UpgradePlanComponent} from "../core/components/upgrade-plan.component";
import {ModalService} from "../lib/ffc-angular/services/modal.service";
import {map} from 'rxjs/operators';

@Injectable()
export class SubscriptionService extends NavoryApi {

	private pathToken = '/subscription/token';
	private pathSubscription = '/subscription';
	private pathInvoices = '/account/invoices';

	constructor(http: Http, private state: State, private modalService: ModalService) {
		super(http);
	}

	getPaymentToken(): Observable<string> {
		return this.get(this.pathToken)
			.pipe(map(data => {
				return data.token
			}));
	}

	getSubscription(): Observable<Subscription> {
		return this.get(this.pathSubscription);
	}

	activateSubscription(planId: string, nonce: string): Observable<any> {
		return this.post(this.pathSubscription, {
			payment_method_nonce: nonce,
			plan_id: planId
		});
	}

	cancelSubscription(): Observable<any> {
		return this.delete(this.pathSubscription);
	}

	getSubscriptionInvoices(): Observable<Invoice[]> {
		return this.get(this.pathInvoices);
	}

	expensesEnabled(): boolean {
		return true;
	}

	incomeEnabled(): boolean {
		return true;
	}

	reportsEnabled(): boolean {
		return true;
	}

	paymentsEnabled(): boolean {
		return true;
	}

	showUpgradeModal() {
		this.modalService.create(UpgradePlanComponent)
			.subscribe((ref: ComponentRef<UpgradePlanComponent>) => {
				ref.instance.onClickPlans.subscribe(() => {
					this.modalService.hideCurrentModal();
				});
			});
	}
}
