import {Injectable} from "@angular/core";
import {User} from "../models/user";

@Injectable()
export class AnalyticsService {

	initIntercom(intercomAppId: string) {
		(window as any).Intercom('boot', {
			app_id: intercomAppId
		});
	}

	shutdownIntercom() {
		(window as any).Intercom('shutdown');
	}

	setIntercomUser(user: User) {
		(window as any).Intercom('update', {
			user_id: user.id,
			user_hash: user.intercom_user_hash,
			name: user.firstname + ' ' + user.lastname,
			email: user.email,
			created_at: parseInt((new Date(user.created_at).getTime() / 1000).toFixed(0)) // Unix timestamp
		});
	}

	trackPageView() {
		(window as any).Intercom('update');
		(window as any).ga('send', 'pageview', location.pathname);
	}

	trackEvent(type: AnalyticsEventType, data: Object = null) {
		(window as any).Intercom("trackEvent", type, data);
	}

}

export enum AnalyticsEventType {
	ClickOnTrialBanner = 'click_on_trial_banner' as any,
	ClickOnPlanBuyButton = 'click_on_plan_buy_button' as any,
	ActivateSubscription = 'activate_subscription' as any,

	InvoiceCreate = 'create_invoice' as any,
	InvoiceUpdate = 'update_invoice' as any,
	InvoiceDelete = 'delete_invoice' as any,
	InvoicePreview = 'preview_invoice' as any,
	InvoiceDownload = 'download_invoice' as any,

	ExpenseCreate = 'create_expense' as any,
	ExpenseUpdate = 'update_expense' as any,
	ExpenseDelete = 'delete_expense' as any,

	IncomeCreate = 'create_income' as any,
	IncomeUpdate = 'update_income' as any,
	IncomeDelete = 'delete_income' as any,

	CustomerCreate = 'create_customer' as any,
	CustomerUpdate = 'update_customer' as any,
	CustomerDelete = 'delete_customer' as any,
}
