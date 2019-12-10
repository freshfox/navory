import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {EmailSettings} from '../../models/email-settings';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Helpers} from '../../core/helpers';
import {AccountService} from '../../services/account.service';

@Component({
	selector: 'nvry-email-settings-edit',
	template: `
        <div class="modal-header">
            <span>{{ headerText }}</span>
        </div>

        <form [formGroup]="form">
            <div class="frame frame--padding">
                <nvry-alert-bar [message]="alertMessage"></nvry-alert-bar>
            </div>
            <div class="frame frame--padding frame--bit-spacing">
                <div class="bit-50">
                    <ff-input [label]="'settings.emails.name' | translate" [formControl]="form.controls.name"
                              [(ngModel)]="config.name"></ff-input>
                    <ff-input [label]="'settings.emails.subject' | translate" [formControl]="form.controls.subject"
                              [(ngModel)]="config.subject"></ff-input>
                    <ff-input [label]="'settings.emails.logo_url' | translate" [formControl]="form.controls.logo_url"
                              [(ngModel)]="config.logo_url"></ff-input>
                    <ff-textarea [label]="'settings.emails.content' | translate" [formControl]="form.controls.content"
                                 [(ngModel)]="config.content"></ff-textarea>
                </div>
                <div class="bit-50">
                    <ff-input [label]="'settings.emails.reply_to' | translate" [formControl]="form.controls.reply_to"
                              [(ngModel)]="config.reply_to"></ff-input>
                    <ff-input [label]="'settings.emails.smtp_host' | translate" [formControl]="form.controls.smtp_host"
                              [(ngModel)]="config.smtp_host"></ff-input>
                    <ff-input [label]="'settings.emails.smtp_port' | translate" [formControl]="form.controls.smtp_port"
                              [(ngModel)]="config.smtp_port"></ff-input>
                    <ff-input [label]="'settings.emails.smtp_user' | translate" [formControl]="form.controls.smtp_user"
                              [(ngModel)]="config.smtp_user"></ff-input>
                    <ff-input [label]="'settings.emails.smtp_password' | translate" [formControl]="form.controls.smtp_password"
                              type="password"
                              [(ngModel)]="config.smtp_password"></ff-input>
                    <ff-input [label]="'settings.emails.smtp_sender_name' | translate"
                              [formControl]="form.controls.smtp_sender_name"
                              [(ngModel)]="config.smtp_sender_name"></ff-input>
                    <ff-input [label]="'settings.emails.smtp_sender_email' | translate"
                              [formControl]="form.controls.smtp_sender_email"
                              [(ngModel)]="config.smtp_sender_email"></ff-input>

                    <ff-input [label]="'settings.emails.bcc_email' | translate"
							  type="email"
                              [formControl]="form.controls.bcc_email"
                              [(ngModel)]="config.bcc_email"></ff-input>
                </div>
            </div>
        </form>

        <div class="modal-footer">
            <button ff-button class="ff-button--secondary"
                    (click)="cancel()">{{ 'general.cancel' | translate }}</button>
            <button ff-button [loading]="loading" (click)="save()">{{ 'general.save' | translate }}</button>
        </div>

	`
})
export class EmailSettingsEditComponent implements OnInit {

	@HostBinding('class') clazz = 'nvry-email-settings-edit';

	@Input() config: EmailSettings;
	@Output() onSaved = new EventEmitter<EmailSettings>();
	@Output() onCancel = new EventEmitter<void>();

	form: FormGroup;
	loading = false;
	headerText: string;
	alertMessage: string;

	constructor(private fb: FormBuilder, private translate: TranslateService, private accountService: AccountService) {
	}

	ngOnInit() {
		this.form = this.fb.group({
			name: ['', Validators.required],
			subject: ['', Validators.required],
			logo_url: ['', Validators.required],
			content: [''],
			reply_to: ['', Validators.compose([Validators.required, Validators.email])],
			smtp_host: ['', Validators.required],
			smtp_port: ['', Validators.required],
			smtp_user: ['', Validators.required],
			smtp_password: ['', Validators.required],
			smtp_sender_name: ['', Validators.required],
			smtp_sender_email: ['', Validators.compose([Validators.required, Validators.email])],
			bcc_email: ['', Validators.email],
		});

		this.config = this.config ? Object.assign({}, this.config) : {};

		this.headerText = this.config.id ? this.translate.instant('settings.emails.edit-title') : this.translate.instant('settings.emails.create-title');
	}

	cancel() {
		this.onCancel.next();
	}

	save() {
		Helpers.validateAllFields(this.form);
		if (this.form.valid) {
			this.loading = true;
			this.config.smtp_port = parseInt(this.config.smtp_port + '', 10);
			this.accountService.saveEmailSettings(this.config)
				.subscribe(
					config => {
						this.loading = false;
						this.config = config;
						this.onSaved.next(Object.assign({}, this.config));
					},
					err => {
						this.loading = false;
					});
		}
	}
}
