import {Injectable} from "@angular/core";
import {User} from "../models/user";
import {Category} from "../models/category";
import {Unit} from "../models/unit";
import {Country} from "../models/country";
import {TaxRate} from "../models/tax-rate";

@Injectable()
export class State {

    user: User;
    selectedExpenseMonthIndex: number;
    selectedIncomeMonthIndex: number;
    expenseCategories: Category[];
    units: Unit[];
    countries: Country[];
    taxRates: TaxRate[];
    nextExpenseNumber: number;
    nextIncomeNumber: number;
    nextInvoiceNumber: number;

    getAustria(): Country {
        var aut;
        this.countries.forEach(country => {
           if(country.cca3 === 'AUT') {
               aut = country;
           }
        });

        return aut;
    }

}
