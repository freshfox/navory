import {BaseInvoice} from "./invoice-base.model";
import {Line} from "./invoice-line";

export class Quote extends BaseInvoice {

	valid_to_date: string;

	constructor(data?: any) {
		super(data);

		this.initLines('quote_lines');
	}

	set quote_lines(lines: any[]) {
		this.lines = lines.map(currentLine => new Line(currentLine));
	}
}

export enum QuoteStatus {
	Draft = 'draft' as any,
	Issued = 'issued' as any,
}

