import {BaseInvoice} from "./invoice-base.model";

export class Quote extends BaseInvoice {

	valid_to_date: string;

	constructor(data?: any) {
		super(data);
	}
}

export enum QuoteStatus {
	Draft = 'draft' as any,
	Issued = 'issued' as any,
}

