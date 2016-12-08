import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {FileService} from "./file.service";
import {State} from "../core/state";
import {Account} from "../models/account";
import {Observable} from "rxjs";

export enum ExportType {
	Income = 'INCOME' as any,
	Expenses = 'EXPENSES' as any
}

@Injectable()
export class AccountService extends BaseService {

	private pathExport = '/account/export';
	private pathAccount = '/account';

	constructor(http: Http, private fileService: FileService, private state: State) {
		super(http);
	}

	getAccount(): Account {
		return this.state.user.account;
	}

	downloadExport(type: ExportType, startDate: string, endDate: string) {
		let path = this.constructApiUrl(this.pathExport + `?type=${type}&from=${startDate}&to=${endDate}`);
		this.fileService.downloadFromURL(path);
	}

	updateAccount(account: Account): Observable<Account> {
		return this.patch(this.pathAccount, account)
			.map((account: Account) => {
				this.state.user.account = account;
				return account;
			});
	}

}
