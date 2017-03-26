import {Injectable} from "@angular/core";

@Injectable()
export class AnalyticsService {

	trackEvent(type: AnalyticsEventType, data: Object = null) {
		(window as any).Intercom("trackEvent", type, data);
	}

}

export enum AnalyticsEventType {
	CreateInvoice = 'create_invoice' as any,
	UpdateInvoice = 'update_invoice' as any
}
