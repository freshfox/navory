import {BaseModel} from "../core/base.model";
export class BankAccount extends BaseModel {

	id?: number;
	name: string;
	manual: boolean;

}
