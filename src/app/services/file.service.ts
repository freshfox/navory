import {NavoryApi} from "./base.service";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {File} from "../models/file";
import {Observable} from "rxjs";

@Injectable()
export class FileService extends NavoryApi {

	private pathFile = '/files';

	constructor(http: Http) {
		super(http);
	}

	getFile(id: number): Observable<File> {
		let path = this.pathFile + `/${id}`;
		return this.get(path);
	}

	downloadFile(file: File) {
		let path = `${this.pathFile}/${file.id}/download`;
		let fullPath = this.constructApiUrl(path);

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
		return this.delete(path);
	}
}
