import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from '@freshfox/ng-core';
import {FileService} from './file.service';
import {Quote} from '../models/quote.model';
import {map} from 'rxjs/operators';
import {LineUtils} from '../utils/line-utils';

@Injectable()
export class QuoteService {

	private pathQuotes = '/quotes';

	constructor(private apiService: ApiService, private fileService: FileService) {

	}

	getQuotes(): Observable<Quote[]> {
		return this.apiService.get(this.pathQuotes)
			.pipe(map((quoteData: any[]) => {
				let quotes: Quote[] = [];
				quoteData.forEach((quoteData) => {
					let quote = new Quote(quoteData);
					quotes.push(quote);
				});
				return quotes;
			}));
	}

	getQuote(id: string): Observable<Quote> {
		return this.apiService.get(this.apiService.getRestEntityPath(this.pathQuotes, id))
			.pipe(map(quoteData => {
				let quote = new Quote(quoteData);
				return quote;
			}));
	}

	saveQuote(quote: Quote) {
		let data = Object.assign({}, quote) as any;
		data.quote_lines = data.lines;

		if (quote.id) {
			return this.apiService.patch(this.apiService.getRestEntityPath(this.pathQuotes, quote.id), data)
				.pipe(map(quote => {
					return new Quote(quote)
				}));
		}
		return this.apiService.post(this.pathQuotes, data)
			.pipe(map(quote => {
				return new Quote(quote);
			}));
	}

	deleteQuote(quote: Quote): Observable<any> {
		return this.apiService.delete(this.apiService.getRestEntityPath(this.pathQuotes, quote.id));
	}

	getTaxAmounts(quote: Quote): any[] {
		return LineUtils.getTaxAmounts(quote.lines);
	}

	getPreviewURL(quote: Quote): string {
		return this.apiService.constructApiUrl(`${this.pathQuotes}/${quote.id}/html`);
	}

	getDownloadURL(quote: Quote): string {
		return this.apiService.constructApiUrl(`${this.pathQuotes}/${quote.id}/pdf`);
	}

	downloadQuotePDF(quote: Quote) {
		let url = this.getDownloadURL(quote);
		this.fileService.downloadFromURL(url);
	}
}

