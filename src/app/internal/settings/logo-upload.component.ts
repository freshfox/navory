import {Component, OnInit, ViewChild, Input, EventEmitter, Output, AfterViewInit} from "@angular/core";
import {environment} from "../../../environments/environment";
import {File} from "../../models/file";
import {AccountService} from "../../services/account.service";
import {TranslateService} from "@ngx-translate/core";
import * as Dropzone from "dropzone";

@Component({
	selector: 'nvry-logo-upload',
	template: `
		<nvry-alert-bar [message]="alertMessage"></nvry-alert-bar>
		<div #uploadArea class="logo-upload__area" [hidden]="logo">
			
			<ff-spinner *ngIf="uploading" [progress]="progress"></ff-spinner>

			<div class="logo-upload__area__content" *ngIf="!uploading">
				<p>
				{{ 'settings.upload-logo' | translate }}
				</p>
				<button ff-button class="dz-clickable button--small">{{ 'upload-area.choose-file' | translate }}</button>
			</div>
			
		</div>
		<div class="logo-upload__img-wrapper" *ngIf="logo">
			<img class="logo-upload__img" src="{{ logo.url }}" alt="" (onChange)="onLogoFileSelected($event)">
			<button class="logo-upload__remove-button" (click)="removeFile()">
				<ff-spinner *ngIf="deleting"></ff-spinner>
				<ff-icon name="cross" *ngIf="!deleting"></ff-icon>
			</button>
		</div>
	`,
	host: {'class': 'logo-upload'}
})
export class LogoUploadComponent implements OnInit, AfterViewInit {

	@Input() logo: File;
	@Output() logoChange: EventEmitter<File> = new EventEmitter<File>();
	private dropzone: Dropzone;
	progress: number = 0;
	uploading: boolean = false;
	deleting: boolean = false;
	alertMessage: string;
	@ViewChild('uploadArea') private uploadArea;

	constructor(private accountService: AccountService, private translate: TranslateService) {
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.dropzone = new Dropzone(this.uploadArea.nativeElement, {
			maxFiles: 1,
			maxFilesize: 2,
			clickable: this.uploadArea.nativeElement.querySelector('.dz-clickable'),
			previewTemplate: '<div></div>',
			acceptedFiles: '.jpg,.jpeg,.png,.gif,.svg',
			url: environment.apiUrl + '/account/settings/logo',
			dictInvalidFileType: this.translate.instant('upload-area.errors.filetype-not-allowed'),
			dictResponseError: this.translate.instant('upload-area.errors.general'),
			dictFileTooBig: this.translate.instant('upload-area.errors.file-too-big'),
		});

		this.dropzone.on('sending', (file, xhr) => {
			//this.alertMessage = null;
			xhr.withCredentials = true;
		});

		this.dropzone.on('totaluploadprogress', (progress) => {
			this.progress = Math.round(progress);
		});

		this.dropzone.on('sending', () => {
			this.uploading = true;
		});

		this.dropzone.on('complete', () => {
			this.uploading = false;
			this.dropzone.removeAllFiles();
		});

		this.dropzone.on('success', (file, response) => {
			this.setFile(response as File);
		});


		this.dropzone.on('error', (file, errorMessage) => {
			this.alertMessage = errorMessage as string;
		});
	}

	private removeFile() {
		this.deleting = true;

		this.accountService.deleteLogo()
			.subscribe(settings => {
				this.deleting = false;
				this.setFile(null);
			});
	}

	private setFile(file: File) {
		this.logo = file;
		this.logoChange.emit(this.logo);
	}

}
