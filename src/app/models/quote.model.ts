import {BaseInvoice} from "./invoice-base.model";

export class Quote extends BaseInvoice {

	valid_to_date: string;

	constructor(data?: any) {
		super(data);

		this.initLines('quote_lines');
	}

	set quote_lines(lines: any[]) {
		this.lines = lines;
	}
}

export enum QuoteStatus {
	Draft = 'draft' as any,
	Issued = 'issued' as any,
}

