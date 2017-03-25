import {Component, OnInit, EventEmitter, Output, Input, ViewChild} from "@angular/core";
import {File} from "../../../models/file";
import {FileService} from "../../../services/file.service";
import {environment} from "../../../../environments/environment";
import {TranslateService} from "ng2-translate";
var Dropzone = require('dropzone');

@Component({
	selector: 'nvry-document-upload',
	templateUrl: './document-upload.component.html'
})
export class DocumentUploadComponent implements OnInit {

	@Input() file: File;
	@Output() fileChange: EventEmitter<File> = new EventEmitter<File>();

	@ViewChild('uploadArea') private uploadArea;

	currentPageIndex: number = 0;
	alertMessage: string;
	loading = false;
	progress = 0;
	uploading = false;

	private dropzone: any;

	constructor(private fileService: FileService, private translate: TranslateService) {

	}

	ngOnInit() {
		if (!this.file) {
			setTimeout(() => {
				this.createNewFile();
			}, 1);
		} else {
			this.loading = true;
			this.fileService.getFile(this.file.id)
				.subscribe((file: File) => {
					this.loading = false;
					this.setFile(file);
				});
		}
	}

	ngAfterViewInit() {
		this.dropzone = new Dropzone(this.uploadArea.nativeElement, {
			clickable: this.uploadArea.nativeElement.querySelector('.dz-clickable'),
			maxFiles: 1,
			previewTemplate: '<div></div>',
			acceptedFiles: '.jpg,.jpeg,.png,.gif,.pdf',
			url: environment.apiUrl + '/files'
		});

		this.dropzone.on('sending', (file, xhr) => {
			this.alertMessage = null;
			xhr.withCredentials = true;
		});

		this.dropzone.on('totaluploadprogress', (progress) => {
			this.progress = progress;
		});

		this.dropzone.on('success', (file, response) => {
			this.setFile(response as File);
		});

		this.dropzone.on('sending', () => {
			this.uploading = true;
		});

		this.dropzone.on('complete', () => {
			this.uploading = false;
			this.dropzone.removeAllFiles();
		});

		this.dropzone.on('error', (file, errorMessage) => {
			if (errorMessage === 'You can\'t upload files of this type.') {
				this.alertMessage = this.translate.instant('upload-area.errors.filetype-not-allowed');
			} else {
				this.alertMessage = this.translate.instant('upload-area.errors.general');
			}
		});
	}

	setFile(file: File) {
		if (!file) {
			this.dropzone.enable();
		} else {
			this.dropzone.disable();
		}
		this.file = file;
		this.fileChange.emit(this.file);
	}

	isFileUploaded() {
		if (!this.file) {
			return false;
		}

		return !!this.file.id;
	}

	hasMultiplePages() {
		if (!this.file || !this.file.thumbnails) {
			return false;
		}

		return this.file.thumbnails.length > 1;
	}

	createNewFile() {
		this.setFile(null);
		this.progress = 0;
	}

	removeFile() {
		this.fileService.deleteFile(this.file.id).subscribe();
		this.createNewFile();
	}

	downloadFile() {
		this.fileService.downloadFile(this.file);
	}

}
