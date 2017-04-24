import {BaseModel} from "../core/base.model";

export class Subscription extends BaseModel {
	plan_id: string;
	period_end_date: string;
}
