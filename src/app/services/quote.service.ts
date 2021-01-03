import {NavoryApi} from './base.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';
import {FileService} from './file.service';
import {Quote} from '../models/quote.model';
import {map} from 'rxjs/operators';
import {LineUtils} from '../utils/line-utils';

@Injectable()
export class QuoteService extends NavoryApi {

	private pathQuotes = '/quotes';

	constructor(http: Http, private fileService: FileService) {
		super(http);
	}

	getQuotes(): Observable<Quote[]> {
		return this.get(this.pathQuotes)
			.pipe(map(quoteData => {
				let quotes: Quote[] = [];
				quoteData.forEach((quoteData) => {
					let quote = new Quote(quoteData);
					quotes.push(quote);
				});
				return quotes;
			}));
	}

	getQuote(id: string): Observable<Quote> {
		return this.get(this.getRestEntityPath(this.pathQuotes, id))
			.pipe(map(quoteData => {
				let quote = new Quote(quoteData);
				return quote;
			}));
	}

	saveQuote(quote: Quote) {
		let data = Object.assign({}, quote) as any;
		data.quote_lines = data.lines;

		if (quote.id) {
			return this.patch(this.getRestEntityPath(this.pathQuotes, quote.id), data)
				.pipe(map(quote => {
					return new Quote(quote)
				}));
		}
		return this.post(this.pathQuotes, data)
			.pipe(map(quote => {
				return new Quote(quote);
			}));
	}

	deleteQuote(quote: Quote): Observable<any> {
		return this.delete(this.getRestEntityPath(this.pathQuotes, quote.id));
	}

	getTaxAmounts(quote: Quote): any[] {
		return LineUtils.getTaxAmounts(quote.lines);
	}

	getPreviewURL(quote: Quote): string {
		return this.constructApiUrl(`${this.pathQuotes}/${quote.id}/html`);
	}

	getDownloadURL(quote: Quote): string {
		return this.constructApiUrl(`${this.pathQuotes}/${quote.id}/pdf`);
	}

	downloadQuotePDF(quote: Quote) {
		let url = this.getDownloadURL(quote);
		this.fileService.downloadFromURL(url);
	}
}

