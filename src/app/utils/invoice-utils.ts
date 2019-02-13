import {Invoice} from '../models/invoice';

export class InvoiceUtils {

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
