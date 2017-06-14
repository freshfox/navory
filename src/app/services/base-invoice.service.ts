import {Injectable} from "@angular/core";
import {BaseInvoice} from "../models/invoice-base.model";
import {Calculator} from "../core/calculator";

@Injectable()
export class BaseInvoiceService {

	getTaxAmounts(invoice: BaseInvoice): any[] {

		var amounts = [];
		invoice.invoice_lines.forEach((line) => {
			var rate = line.getTaxrate();
			var taxAmount = line.getTaxAmount();
			var netAmount = line.getNetAmount();

			if (rate !== 0 && netAmount !== 0) {
				var amount = amounts.find(amount => {
					return amount.rate == rate;
				});

				if (!amount) {
					amount = {
						rate: rate,
						amount: 0,
						netAmount: 0
					};
					amounts.push(amount);
				}


				amount.amount = Calculator.add(amount.amount, taxAmount);
				amount.netAmount = Calculator.add(amount.netAmount, netAmount);
			}
		});

		amounts.sort((a, b) => {
			return a.rate > b.rate ? 1 : -1;
		});

		return amounts;
	}

}
