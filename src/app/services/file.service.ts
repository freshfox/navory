import {Injectable} from '@angular/core';
import {ApiService} from '@freshfox/ng-core';
import {File} from '../models/file';
import {Observable} from 'rxjs';

@Injectable()
export class FileService {

	private pathFile = '/files';

	constructor(private apiService: ApiService) {

	}

	getFile(id: number): Observable<File> {
		let path = this.pathFile + `/${id}`;
		return this.apiService.get(path);
	}

	downloadFile(file: File) {
		let path = `${this.pathFile}/${file.id}/download`;
		let fullPath = this.apiService.constructApiUrl(path);

		this.downloadFromURL(fullPath);
	}

	downloadFromURL(url: string) {
		//Creating new link node.
		var link = document.createElement('a');
		link.href = url;

		//If in Chrome or Safari - download via virtual link click
		if (this.isChrome() || this.isSafari()) {
			if (link.download !== undefined) {
				//Set HTML5 download attribute. This will prevent file from opening if supported.
				var fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
				link.download = fileName;
			}

			//Dispatching click event.
			if (document.createEvent) {
				var e = document.createEvent('MouseEvents');
				e.initEvent('click', true, true);
				link.dispatchEvent(e);
				return true;
			}
		}

		window.open(url, '_blank');
	}

	private isChrome(): boolean {
		return this.isUserAgentStartingWith('chrome');
	}

	private isSafari(): boolean {
		return this.isUserAgentStartingWith('safari');
	}

	private isUserAgentStartingWith(string): boolean {
		return navigator.userAgent.toLowerCase().indexOf(string) > -1;
	}

	deleteFile(id: number) {
		let path = this.pathFile + '/' + id;
		return this.apiService.delete(path);
	}
}
