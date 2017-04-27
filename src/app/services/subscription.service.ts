import {ComponentRef, Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Subscription} from "../models/subscription";
import {Invoice} from "../models/invoice";
import {State} from "../core/state";
import {ModalService} from "../core/modal.module";
import {UpgradePlanComponent} from "../core/components/upgrade-plan.component";

@Injectable()
export class SubscriptionService extends BaseService {

	private pathToken = '/subscription/token';
	private pathSubscription = '/subscription';
	private pathInvoices = '/subscription/invoices';

	constructor(http: Http, private state: State, private modalService: ModalService) {
		super(http);
	}

	getPaymentToken(): Observable<string> {
		return this.get(this.pathToken)
			.map(data => {
				return data.token
			});
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
		return this.state.features.expenses;
	}

	incomeEnabled(): boolean {
		return this.state.features.income;
	}

	reportsEnabled(): boolean {
		return this.state.features.reports;
	}

	paymentsEnabled(): boolean {
		return this.state.features.payments;
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
