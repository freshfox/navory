import {Injectable} from "@angular/core";


@Injectable()
export class LocalStorageService {

	private localStorage: any;

	constructor() {
		if (!localStorage) {
			throw new Error('Current browser does not support Local Storage');
		}
		this.localStorage = localStorage;
	}

	clearAll() {
		this.localStorage.clear();
	}

	set(key: any, value: any) {
		this.localStorage[key] = value;
	}

	get(key: any): any {
		return this.localStorage[key];
	}

	setObject(key: any, value: Object): void {
		if (!value) {
			this.remove(key);
			return;
		}
		this.setString(key, JSON.stringify(value));
	}

	setString(key: any, value: String) {
		this.localStorage[key] = value;
	}

	getObject(key: any): any {
		let json = this.get(key);
		if (!json) {
			return null;
		}
		let data = JSON.parse(json);
		if (!data || data.length <= 0) {
			return null;
		}
		return data;
	}

	remove(key: any): any {
		this.localStorage.removeItem(key);
	}
}
