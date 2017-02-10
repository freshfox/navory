import {File} from "./file";
import {Category} from "./category";
import {TaxRate} from "./tax-rate";
import {EuVatType} from "../core/enums/eu-vat-type.enum";

export class Expense {

	id: number;
	number: number;
	date: string;
	description: string;
	price: number = 0;
	file: File;
	tax_rate: TaxRate;
	eu_tax_rate: TaxRate;
	eu_vat_type: EuVatType;
	category: Category;

}
