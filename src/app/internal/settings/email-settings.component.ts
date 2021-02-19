import {Component, ComponentRef, HostBinding, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {EmailSettings} from '../../models/email-settings';
import {TranslateService} from '@ngx-translate/core';
import {EmailSettingsEditComponent} from './email-settings-edit.component';
import {Customer} from '../../models/customer';
import {DialogService, DialogType, SortDirection, TableOptions} from '@freshfox/ng-core';

@Component({
	selector: 'nvry-email-settings',
	template: `
        <div class="page-row page-header">
            <button ff-button class="ff-button--no-margin create-button" (click)="createConfig()"
                    icon="plus">
                {{ 'settings.emails.create' | translate }}
            </button>
        </div>

        <ff-table [rows]="settings"
                  [options]="tableOptions"
                  [loading]="loading"
                  (onRowClicked)="editConfig($event)">

            <div empty class="empty-view">
                <p class="title" [innerHTML]="'settings.emails.empty-state-message' | translate"></p>
                <button ff-button icon="plus"
                        (click)="createConfig()">{{ 'settings.emails.create' | translate }}</button>
            </div>

        </ff-table>

        <ng-template #actionsColumn let-row="row" let-value="value">
            <ff-dropdown>
                <button (click)="editConfig(row)">{{ 'actions.edit' | translate }}</button>
                <button (click)="deleteConfig(row)">{{ 'actions.delete' | translate }}</button>
            </ff-dropdown>
        </ng-template>

	`
})
export class EmailSettingsComponent implements OnInit {

	@HostBinding('class') clazz = 'nvry-email-settings';

	settings: EmailSettings[] = [];
	loading = true;
	tableOptions: TableOptions;

	@ViewChild('actionsColumn', { static: true }) private actionsColumn: TemplateRef<any>;

	constructor(private accountService: AccountService, private translate: TranslateService, private dialogService: DialogService) {
	}

	ngOnInit() {
		this.tableOptions = new TableOptions({
			columns: [
				{name: this.translate.instant('general.name'), prop: 'name', sortDirection: SortDirection.Asc},
				{name: this.translate.instant('general.email'), prop: 'smtp_sender_email', width: 20},
				{width: 4, cellTemplate: this.actionsColumn, sortable: false},
			]
		});

		this.fetchSettings();
	}

	fetchSettings() {
		this.loading = true;
		this.accountService.getEmailSettings()
			.subscribe((settings) => {
				this.settings = settings;
				this.loading = false;
			});
	}

	createConfig() {
		this.editConfig();
	}

	editConfig(config?: EmailSettings) {
		const ref = this.dialogService.create(EmailSettingsEditComponent, {
			parameters: {
				config,
			}
		})

		ref.componentInstance.onSaved.subscribe((savedCustomer: Customer) => {
			ref.close();
			this.fetchSettings();
		});

		ref.componentInstance.onCancel.subscribe(() => {
			ref.close();
		});
	}

	deleteConfig(config: EmailSettings) {
		this.dialogService.createConfirmRequest(
			this.translate.instant('settings.emails.delete-confirm-title'),
			this.translate.instant('settings.emails.delete-confirm-message'),
			null,
			null,
			DialogType.Danger
		).subscribe((confirmed) => {
			if (!confirmed) {
				return;
			}

			this.accountService.deleteEmailSettings(config).subscribe();
			this.fetchSettings();
		});
	}
}
