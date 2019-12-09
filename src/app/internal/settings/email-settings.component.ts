import {Component, ComponentRef, HostBinding, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {EmailSettings} from '../../models/email-settings';
import {TableOptions} from '../../lib/ffc-angular/components/table/table-options.model';
import {SortDirection} from '../../lib/ffc-angular/components/table/sort-direction.enum';
import {TranslateService} from '@ngx-translate/core';
import {ModalService} from '../../lib/ffc-angular/services/modal.service';
import {EmailSettingsEditComponent} from './email-settings-edit.component';
import {Customer} from '../../models/customer';

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

	@ViewChild('actionsColumn') private actionsColumn: TemplateRef<any>;

	constructor(private accountService: AccountService, private translate: TranslateService, private modalService: ModalService) {
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
		this.modalService.create(EmailSettingsEditComponent, {
			parameters: {
				config,
			}
		}).subscribe((ref: ComponentRef<EmailSettingsEditComponent>) => {
			ref.instance.onSaved.subscribe((savedCustomer: Customer) => {
				this.fetchSettings();
				this.modalService.hideCurrentModal();
			});

			ref.instance.onCancel.subscribe(() => {
				this.modalService.hideCurrentModal();
			});
		});
	}

	deleteConfig(config: EmailSettings) {
		this.modalService.createConfirmRequest(
			this.translate.instant('settings.emails.delete-confirm-title'),
			this.translate.instant('settings.emails.delete-confirm-message'),
			() => {
				this.modalService.hideCurrentModal();
			},
			() => {
				this.accountService.deleteEmailSettings(config).subscribe();
				this.fetchSettings();
				this.modalService.hideCurrentModal();
			}
		);
	}
}
