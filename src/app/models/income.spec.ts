import {async} from "@angular/core/testing";
import {Income} from "./income";
import {Payment} from "./payment";

describe('Income', () => {

	it('should calculate the unpaid amount properly', async(() => {
		let income = new Income({
			price: 100,
			unpaid_amount: 100
		});
		let unpaidAmount = income.unpaid_amount;

		expect(unpaidAmount).toEqual(100);


		let income2 = new Income({
			price: 100,
			payments: [
				new Payment({
					_pivot_amount: 50
				})
			]
		});
		let unpaidAmount2 = income2.unpaid_amount;

		expect(unpaidAmount2).toEqual(50);
	}));

	it('should calculate the gross amount', async(() => {
		let income = new Income({
			price: 100,
			tax_rate: {
				rate: 20
			}
		});

		expect(income.getAmountGross()).toEqual(120);
	}));

});
