import {File} from "./file";
import {Category} from "./category";
import {TaxRate} from "./tax-rate";
import {EuVatType} from "../core/enums/eu-vat-type.enum";

export class Income {

    id: number;
    date: string;
    description: string;
    category: Category;
    price: number = 0;
    tax_rate: TaxRate;
    file: File;
    eu_vat_type: EuVatType;

}
