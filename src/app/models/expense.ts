import {File} from "./file";
import {Category} from "./category";
import {TaxRate} from "./tax-rate";

export enum EuVatType {
    None = null,
    ReverseCharge = 'reverse_charge' as any,
    IntraCommunityAcquisition = 'ica' as any
}

export class Expense {

    id: number;
    number: number;
    date: string;
    description: string;
    price: number;
    file: File;
    tax_rate: TaxRate;
    eu_vat_tax_rate: TaxRate;
    eu_vat_type: EuVatType;
    category: Category;

}
