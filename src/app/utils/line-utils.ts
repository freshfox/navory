import {Calculator} from '../core/calculator';
import {Line} from '../models/invoice-line';

export class LineUtils {

	static getNetAmount(line: Line): number {
		return Calculator.toCents(line.price) * line.quantity / 100;
	}

	static getGrossAmount(line: Line): number {
		return Calculator.add(this.getNetAmount(line), this.getTaxAmount(line));
	}

	static getTaxAmount(line: Line): number {
		return this.getNetAmount(line) * this.getTaxrate(line) / 100;
	}

	static getTaxrate(line): number {
		let taxrate = line.tax_rate;
		if (taxrate) {
			return taxrate.rate;
		}

		return null;
	}

	static newLine(line: Partial<Line> = {}): Line {
		return Object.assign({}, line, {
			price: 0,
			quantity: 1,
		}) as Line;
	}

	static getTotalNet(lines: Line[] = []): number {
		let amount = 0;
		lines.forEach(line => {
			amount = Calculator.add(amount, this.getNetAmount(line));
		});

		return amount;
	}

	static getTotalGross(lines: Line[] = []): number {
		let amount = 0;
		lines.forEach(line => {
			amount = Calculator.add(amount, this.getGrossAmount(line));
		});

		return amount;
	}

	static getTaxAmounts(lines: Line[] = []): any[] {

		const amounts = [];
		lines.forEach((line) => {
			const rate = this.getTaxrate(line);
			const taxAmount = this.getTaxAmount(line);
			const netAmount = this.getNetAmount(line);

			if (rate !== 0 && netAmount !== 0) {
				let amount = amounts.find(amount => {
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
