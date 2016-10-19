import {Component, OnInit} from '@angular/core';
import {Input} from "@angular/core/src/metadata/directives";
import {File} from "../../../models/file";
import {FileService} from "../../../services/file.service";
import * as Dropzone from 'dropzone';
import {environment} from "../../../../environments/environment";
import {ViewChild} from "@angular/core/src/metadata/di";

@Component({
    selector: 'nvry-document-upload',
    templateUrl: 'document-upload.component.html'
})
export class DocumentUploadComponent implements OnInit {

    @Input() file: File;
    @ViewChild('uploadArea') private uploadArea;

    private currentPageIndex: number = 0;
    private alertMessage: string;
    private loading = false;
    private progress = 0;
    private uploading = false;

    private dropzone: Dropzone;

    constructor(private fileService: FileService) {

    }

    ngOnInit() {
        if (!this.file) {
            this.file = new File;
            this.file.thumbnails = [];
        } else {
            this.loading = true;
            this.fileService.getFile(this.file.id)
                .subscribe((file: File) => {
                    this.loading = false;
                    this.file = file;
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
            xhr.withCredentials = true;
        });

        this.dropzone.on('totaluploadprogress', (progress) => {
            this.progress = progress;
        });

        this.dropzone.on('success', (file, response) => {
            this.file = response as File;
        });

        this.dropzone.on('sending', () => {
            this.uploading = true;
        });

        this.dropzone.on('complete', () => {
            this.uploading = false;
        });
    }

    isFileUploaded() {
        if(!this.file) {
            return false;
        }

        return !!this.file.id;
    }

    hasMultiplePages() {
        if(!this.file) {
            return false;
        }

        return this.file.thumbnails.length > 1;
    }

    removeFile() {
    }

    downloadFile() {
    }

}
