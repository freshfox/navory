import {Account} from "./account";
import {BaseModel} from "../core/base.model";

export class User extends BaseModel {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	account: Account;
	intercom_user_hash: string;
	created_at: string;

	get fullName(): string {
		return `${this.firstname} ${this.lastname}`;
	}
}
