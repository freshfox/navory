import {TaxRate} from "./tax-rate";
import {BaseModel} from "../core/base.model";

export class InvoiceLine extends BaseModel {

    id: number;
    title: string;
    description: string;
    quantity: number = 1;
    price: number = 0;
    tax_rate_id: number;
    tax_rate: TaxRate;
    unit_id: number;

    getNetAmount(): number {
        return this.price * this.quantity;
    }

    getGrossAmount(): number {
        return this.getNetAmount() + this.getTaxAmount();
    }

    getTaxAmount(): number {
        return this.getNetAmount() * this.getTaxrate() / 100;
    }

    getTaxrate(): number {
        let taxrate = this.tax_rate;
        if (taxrate) {
            return taxrate.rate;
        }

        return null;
    }

}
