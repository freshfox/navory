import {File} from "./file";
import {Category} from "./category";
import {TaxRate} from "./tax-rate";

export class Expense {

    id: number;
    number: number;
    date: string;
    description: string;
    price: number;
    file: File;
    tax_rate: TaxRate;
    category: Category;

}
