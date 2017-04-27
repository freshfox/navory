import {BaseModel} from "../core/base.model";

export class AccountFeatures extends BaseModel {

	income: boolean;
	expenses: boolean;
	payments: boolean;
	reports: boolean;

}
