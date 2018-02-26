import {NavoryApi} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {Invoice, InvoiceStatus} from '../models/invoice';
import {FileService} from "./file.service";
import {AnalyticsService, AnalyticsEventType} from "./analytics.service";
import {BaseInvoiceService} from "./base-invoice.service";
import {TranslateService} from '@ngx-translate/core';
const moment = require('moment');

@Injectable()
export class InvoiceService extends NavoryApi {

	private pathInvoices = '/invoices';
	private pathAccountInvoices = '/account/invoices';

	constructor(http: Http, private fileService: FileService, private analytics: AnalyticsService, private baseInvoiceService: BaseInvoiceService, private translate: TranslateService) {
		super(http);
	}

	getInvoices(): Observable<Invoice[]> {
		return this.get(this.pathInvoices)
			.map(invoicesData => {
				let invoices: Invoice[] = [];
				invoicesData.forEach((invoiceData) => {
					let invoice = new Invoice(invoiceData);
					invoices.push(invoice);
				});
				return invoices;
			});
	}

	getInvoice(id: string): Observable<Invoice> {
		return this.get(this.getRestEntityPath(this.pathInvoices, id))
			.map(invoiceData => {
				let invoice = new Invoice(invoiceData);

				if(!invoice.locale) {
					invoice.locale = 'de';
				}

				return invoice;
			});
	}

	saveInvoice(invoice: Invoice) {
		let data = Object.assign({}, invoice) as any;
		data.invoice_lines = data.lines;

		if (invoice.id) {
			return this.patch(this.getRestEntityPath(this.pathInvoices, invoice.id), data)
				.map(invoice => {
					this.analytics.trackEvent(AnalyticsEventType.InvoiceUpdate);
					return new Invoice(invoice)
				});
		}
		return this.post(this.pathInvoices, data)
			.map(invoice => {
				this.analytics.trackEvent(AnalyticsEventType.InvoiceCreate);
				return new Invoice(invoice);
			});
	}

	deleteInvoice(invoice: Invoice): Observable<any> {
		this.analytics.trackEvent(AnalyticsEventType.InvoiceDelete);

		return this.delete(this.getRestEntityPath(this.pathInvoices, invoice.id));
	}

	getTaxAmounts(invoice: Invoice): any[] {
		return this.baseInvoiceService.getTaxAmounts(invoice);
	}

	getPreviewURL(invoice: Invoice): string {
		return this.constructApiUrl(`${this.pathInvoices}/${invoice.id}/html`);
	}

	getDownloadURL(invoice: Invoice): string {
		return this.constructApiUrl(`${this.pathInvoices}/${invoice.id}/pdf`);
	}

	getSubscriptionDownloadUrl(invoice: Invoice): string {
		return this.constructApiUrl(`${this.pathAccountInvoices}/${invoice.id}/pdf`);
	}

	downloadInvoicePDF(invoice: Invoice) {
		let url = this.getDownloadURL(invoice);
		this.analytics.trackEvent(AnalyticsEventType.InvoiceDownload);
		this.fileService.downloadFromURL(url);
	}

	downloadSubscriptionInvoicePDF(invoice: Invoice) {
		let url = this.getSubscriptionDownloadUrl(invoice);
		this.fileService.downloadFromURL(url);
	}


	getBadgeData(invoice) {
		let text;
		let badgeClass;
		switch (this.getInvoiceStatus(invoice)) {
			case InvoiceStatus.Canceled:
				text = this.translate.instant('general.canceled');
				badgeClass = 'gray';
				break;
			case InvoiceStatus.Draft:
				text = this.translate.instant('general.draft');
				badgeClass = 'clear';
				break;
			case InvoiceStatus.Paid:
				text = this.translate.instant('general.paid');
				badgeClass = 'income';
				break;
			case InvoiceStatus.PartlyPaid:
				text = this.translate.instant('general.partly-paid');
				badgeClass = 'income-part';
				break;
			case InvoiceStatus.Overdue:
				text = this.translate.instant('general.overdue');
				badgeClass = 'expense';
				break;
			case InvoiceStatus.Issued:
				text = this.translate.instant('invoices.issued');
				badgeClass = 'customer';
				break;
			default:
				break;
		}

		return {
			text: text,
			cssClass: badgeClass
		};
	}

	getInvoiceStatus(invoice: Invoice): InvoiceStatus {
		let status;

		if (invoice.canceled) {
			return InvoiceStatus.Canceled;
		}

		if (invoice.draft) {
			status = InvoiceStatus.Draft;
		} else {
			status = InvoiceStatus.Issued;
			if (this.isInvoicePaid(invoice)) {
				status = InvoiceStatus.Paid;
			} else if (this.isInvoicePartlyPaid(invoice)) {
				status = InvoiceStatus.PartlyPaid;
			} else if (this.isInvoiceOverdue(invoice)) {
				status = InvoiceStatus.Overdue;
			}
		}

		return status;
	}

	isInvoicePartlyPaid(invoice: Invoice) {
		return invoice.payments.length > 0 && !this.isInvoicePaid(invoice);
	}

	isInvoiceOverdue(invoice) {
		if (!this.isInvoicePaid(invoice)) {
			return moment().startOf('day').isAfter(invoice.due_date);
		}

		return false;
	}

	isInvoicePaid(invoice) {
		return invoice.unpaid_amount == 0;
	}

}

