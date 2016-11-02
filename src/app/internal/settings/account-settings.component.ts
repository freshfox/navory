import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/account";
import {ErrorHandler} from "../../core/error-handler";
import {NotificationsService} from "angular2-notifications/src/notifications.service";
import {TranslateService} from "ng2-translate";

@Component({
    templateUrl: 'account-settings.component.html'
})
export class AccountSettingsComponent implements OnInit {

    private account: Account;
    private loading: boolean = false;
    private alertMessage: string;

    constructor(private accountService: AccountService,
                private errorHandler: ErrorHandler,
                private notificationService: NotificationsService,
                private translate: TranslateService) {
        this.account = Object.assign({}, this.accountService.getAccount());
    }

    ngOnInit() {
    }

    save() {
        this.loading = true;
        this.accountService.updateAccount(this.account)
            .subscribe(
                account => {
                    this.loading = false;
                    this.notificationService.success('', this.translate.instant('settings.company.success-message'));
                },
                error => {
                    this.alertMessage = this.errorHandler.getDefaultErrorMessage(error.code);
                    this.loading = false;
                }
            );
    }

}
