import {Injectable} from "@angular/core";
import {User} from "../models/user";
import {Category} from "../models/category";
import {Unit} from "../models/unit";
import {Country} from "../models/country";
import {TaxRate} from "../models/tax-rate";
import {AccountFeatures} from "../models/account-features";
import {Subscription} from "../models/subscription";

@Injectable()
export class State {

	user: User;
	selectedExpenseMonthIndex: number;
	selectedExpenseYear: number;
	selectedIncomeMonthIndex: number;
	selectedIncomeYear: number;
	expenseCategories: Category[];
	units: Unit[];
	countries: Country[];
	taxRates: TaxRate[];
	nextExpenseNumber: number;
	nextIncomeNumber: number;
	nextInvoiceNumber: number;
	nextQuoteNumber: number;
	features: AccountFeatures;
	subscription: Subscription;

}
