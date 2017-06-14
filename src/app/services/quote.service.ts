import {NavoryApi} from "./base.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {FileService} from "./file.service";
import {AnalyticsService, AnalyticsEventType} from "./analytics.service";
import {Quote} from "../models/quote.model";
import {BaseInvoiceService} from "./base-invoice.service";

@Injectable()
export class QuoteService extends NavoryApi {

	private pathQuotes = '/quotes';

	constructor(http: Http, private fileService: FileService, private analytics: AnalyticsService, private baseInvoiceService: BaseInvoiceService) {
		super(http);
	}

	getQuotes(): Observable<Quote[]> {
		return this.get(this.pathQuotes)
			.map(quoteData => {
				let quotes: Quote[] = [];
				quoteData.forEach((quoteData) => {
					let quote = new Quote(quoteData);
					quotes.push(quote);
				});
				return quotes;
			});
	}

	getQuote(id: string): Observable<Quote> {
		return this.get(this.getRestEntityPath(this.pathQuotes, id))
			.map(quoteData => {
				let quote = new Quote(quoteData);
				return quote;
			});
	}

	saveInvoice(quote: Quote) {
		if (quote.id) {
			return this.patch(this.getRestEntityPath(this.pathQuotes, quote.id), quote)
				.map(quote => {
					this.analytics.trackEvent(AnalyticsEventType.QuoteUpdate);
					return new Quote(quote)
				});
		}
		return this.post(this.pathQuotes, quote)
			.map(quote => {
				this.analytics.trackEvent(AnalyticsEventType.QuoteCreate);
				return new Quote(quote);
			});
	}

	deleteQuote(quote: Quote): Observable<any> {
		this.analytics.trackEvent(AnalyticsEventType.QuoteDelete);

		return this.delete(this.getRestEntityPath(this.pathQuotes, quote.id));
	}

	getTaxAmounts(quote: Quote): any[] {
		return this.baseInvoiceService.getTaxAmounts(quote);
	}

	getPreviewURL(quote: Quote): string {
		return this.constructApiUrl(`${this.pathQuotes}/${quote.id}/html`);
	}

	getDownloadURL(quote: Quote): string {
		return this.constructApiUrl(`${this.pathQuotes}/${quote.id}/pdf`);
	}

	downloadQuotePDF(quote: Quote) {
		let url = this.getDownloadURL(quote);
		this.analytics.trackEvent(AnalyticsEventType.QuoteDownload);
		this.fileService.downloadFromURL(url);
	}
}

