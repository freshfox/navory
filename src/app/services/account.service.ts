import {NavoryApi} from "./base.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {FileService} from "./file.service";
import {State} from "../core/state";
import {Account} from "../models/account";
import {Observable} from "rxjs";
import {AccountSettings} from "../models/account-settings";

export enum ExportType {
	Income = 'INCOME' as any,
	Expenses = 'EXPENSES' as any,
	Invoices = 'INVOICES' as any
}

@Injectable()
export class AccountService extends NavoryApi {

	private pathExport = '/account/export';
	private pathAccount = '/account';
	private pathAccountSettings = '/account/settings';
	private pathPaymentToken = '/payment/token';

	constructor(http: Http, private fileService: FileService, private state: State) {
		super(http);
	}

	getAccount(): Account {
		return this.state.user.account;
	}

	getSettings(): Observable<AccountSettings> {
		return this.get(this.pathAccountSettings);
	}

	deleteLogo(): Observable<AccountSettings> {
		return this.patch(this.pathAccountSettings, { logo: null });
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

	/**
	 * Get a one-time Braintree payment token that can be used to enter payment information
	 * @returns {Observable<any>}
	 */
	getPaymentToken(): Observable<string> {
		return this.get(this.pathPaymentToken);
	}

}
