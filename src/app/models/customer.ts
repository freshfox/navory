import {BaseModel} from "../core/base.model";

export class Customer extends BaseModel {
	id: string;
	number: string;
	name: string;
	address: string;
	email: string;
	phone: string;
	vat_number: string;
	country_code: string;
}
