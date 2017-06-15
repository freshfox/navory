import {NavoryApi} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {Invoice} from "../models/invoice";
import {FileService} from "./file.service";
import {AnalyticsService, AnalyticsEventType} from "./analytics.service";
import {BaseInvoiceService} from "./base-invoice.service";

@Injectable()
export class InvoiceService extends NavoryApi {

	private pathInvoices = '/invoices';
	private pathAccountInvoices = '/account/invoices';

	constructor(http: Http, private fileService: FileService, private analytics: AnalyticsService, private baseInvoiceService: BaseInvoiceService) {
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
}

