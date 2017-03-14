import {Component, OnInit, ViewChild, Input, EventEmitter, Output, AfterViewInit} from "@angular/core";
import {environment} from "../../../environments/environment";
import {File} from "../../models/file";
import {AccountService} from "../../services/account.service";
import {TranslateService} from "ng2-translate";

let Dropzone = require('dropzone');

@Component({
	selector: 'nvry-logo-upload',
	template: `
		<nvry-alert-bar [message]="alertMessage"></nvry-alert-bar>
		<div #uploadArea class="logo-upload__area" [hidden]="logo">
			
			<nvry-spinner *ngIf="uploading" [progress]="progress"></nvry-spinner>

			<div class="logo-upload__area__content" *ngIf="!uploading">
				<p>
				{{ 'settings.upload-logo' | translate }}
				</p>
				<nvry-button class="dz-clickable button--small">{{ 'upload-area.choose-file' | translate }}</nvry-button>
			</div>
			
		</div>
		<div class="logo-upload__img-wrapper" *ngIf="logo">
			<img class="logo-upload__img" src="{{ logo.url }}" alt="" (onChange)="onLogoFileSelected($event)">
			<button class="logo-upload__remove-button" (click)="removeFile()">
				<nvry-spinner *ngIf="deleting"></nvry-spinner>
				<nvry-icon name="cross" *ngIf="!deleting"></nvry-icon>
			</button>
		</div>
	`,
	host: {'class': 'logo-upload'}
})
export class LogoUploadComponent implements OnInit, AfterViewInit {

	@Input() logo: File;
	@Output() logoChange: EventEmitter<File> = new EventEmitter<File>();
	private dropzone: Dropzone;
	private progress: number = 0;
	private uploading: boolean = false;
	private deleting: boolean = false;
	private alertMessage: string;
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
			this.alertMessage = errorMessage;
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
