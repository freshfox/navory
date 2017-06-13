import {ComponentRef, Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Subscription} from "../models/subscription";
import {Invoice} from "../models/invoice";
import {State} from "../core/state";
import {UpgradePlanComponent} from "../core/components/upgrade-plan.component";
import {ModalService} from "ffc-angular";

@Injectable()
export class SubscriptionService extends BaseService {

	private pathToken = '/subscription/token';
	private pathSubscription = '/subscription';
	private pathInvoices = '/account/invoices';

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
		return this.state.features.expense_access;
	}

	incomeEnabled(): boolean {
		return this.state.features.income_access;
	}

	reportsEnabled(): boolean {
		return this.state.features.report_uva;
	}

	paymentsEnabled(): boolean {
		return this.state.features.report_uva;
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
