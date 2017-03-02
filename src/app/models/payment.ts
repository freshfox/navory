import {BaseModel} from "../core/base.model";

export class Payment extends BaseModel {

	id: number;
	date: string;
	description: string;
	amount: number;

}
