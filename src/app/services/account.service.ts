import {Injectable} from '@angular/core';
import {FileService} from './file.service';
import {State} from '../core/state';
import {Account} from '../models/account';
import {Observable} from 'rxjs';
import {AccountSettings} from '../models/account-settings';
import {map} from 'rxjs/operators';
import {EmailSettings} from '../models/email-settings';
import {ApiService} from '@freshfox/ng-core';

export enum ExportType {
	Income = 'INCOME' as any,
	Expenses = 'EXPENSES' as any,
	Invoices = 'INVOICES' as any,
	Payments = 'PAYMENTS' as any,
}

@Injectable()
export class AccountService {

	private pathExport = '/account/export';
	private pathAccount = '/account';
	private pathAccountSettings = '/account/settings';
	private pathPaymentToken = '/payment/token';
	private pathAnnualAccountsExport = '/account/export-year';
	private pathEmailSettings = '/emailsettings';

	constructor(private apiService: ApiService, private fileService: FileService, private state: State) {
	}

	getAccount(): Account {
		return this.state.user.account;
	}

	getSettings(): Observable<AccountSettings> {
		return this.apiService.get(this.pathAccountSettings);
	}

	getEmailSettings(): Observable<EmailSettings[]> {
		return this.apiService.get(this.pathEmailSettings);
	}

	saveEmailSettings(settings: EmailSettings) {
		if (settings.id) {
			return this.apiService.patch(this.apiService.getRestEntityPath(this.pathEmailSettings, settings.id + ''), settings);
		}
		return this.apiService.post(this.pathEmailSettings, settings);
	}

	deleteEmailSettings(settings: EmailSettings) {
		return this.apiService.delete(this.apiService.getRestEntityPath(this.pathEmailSettings, settings.id + ''));
	}

	deleteLogo(): Observable<AccountSettings> {
		return this.apiService.patch(this.pathAccountSettings, {logo: null});
	}

	downloadExport(type: ExportType, startDate: string, endDate: string) {
		let path = this.apiService.constructApiUrl(this.pathExport + `?type=${type}&from=${startDate}&to=${endDate}`);
		this.fileService.downloadFromURL(path);
	}

	downloadAnnualAccountsExport(year: number) {
		return this.apiService.post(this.pathAnnualAccountsExport, {year: year});
	}

	updateAccount(account: Account): Observable<Account> {
		return this.apiService.patch(this.pathAccount, account)
			.pipe(map((account: Account) => {
				this.state.user.account = account;
				return account;
			}));
	}

	/**
	 * Get a one-time Braintree payment token that can be used to enter payment information
	 * @returns {Observable<any>}
	 */
	getPaymentToken(): Observable<string> {
		return this.apiService.get(this.pathPaymentToken);
	}

}
