import {IntervalUnit, Invoice, RecurringInvoice} from '../models/invoice';
import {LineUtils} from './line-utils';

export class InvoiceUtils {

	static getTotalNet(invoice: Invoice): number {
		return LineUtils.getTotalNet(invoice.lines);
	}

	static getTotalGross(invoice: Invoice): number {
		return LineUtils.getTotalGross(invoice.lines);
	}

	static newRecurringInvoice(): RecurringInvoice {
		return {
			lines: [],
			locale: 'de',
			count: 12,
			interval_unit: IntervalUnit.MONTHLY
		}
	}

	static getCompleteNumber(invoice: Invoice): string {
		if (!invoice.number) {
			return '';
		}

		let number = '' + invoice.number;
		if (invoice.group_prefix) {
			number = invoice.group_prefix + '-' + number;
		}

		return number;
	}

}
