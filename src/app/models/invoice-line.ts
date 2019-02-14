import {TaxRate} from './tax-rate';
import {Unit} from './unit';

export interface Line {

	id?: number;
	title?: string;
	description?: string;
	quantity?: number;
	price: number;
	tax_rate: TaxRate;
	unit?: Unit;

}
