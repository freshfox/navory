import {Component, OnInit} from "@angular/core";
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/account";
import {ErrorHandler} from "../../core/error-handler";
import {SnackBarService} from '@freshfox/ng-core';
import {TranslateService} from "@ngx-translate/core";
import {AccountSettings} from "../../models/account-settings";
import {BootstrapService} from "../../services/bootstrap.service";

@Component({
	templateUrl: './account-settings.component.html'
})
export class AccountSettingsComponent implements OnInit {

	account: Account;
	settings: AccountSettings;

	saving: boolean = false;
	alertMessage: string;

	constructor(private accountService: AccountService,
				private bootstrapService: BootstrapService,
				private errorHandler: ErrorHandler,
				private snackbar: SnackBarService,
				private translate: TranslateService) {
		this.account = Object.assign({}, this.accountService.getAccount());
	}

	ngOnInit() {

		this.accountService.getSettings()
			.subscribe(settings => {
				this.settings = settings;
			});
	}

	save() {
		this.saving = true;
		this.accountService.updateAccount(this.account)
			.subscribe(
				account => {
					this.saving = false;
					this.snackbar.success(this.translate.instant('settings.company.success-message'));
				},
				error => {
					this.alertMessage = this.errorHandler.getDefaultErrorMessage(error.code);
					this.saving = false;
				}
			);
	}

	get accountCountryName(): string {
		return this.bootstrapService.getCountryByCode(this.account.country_code).name;
	}
}
