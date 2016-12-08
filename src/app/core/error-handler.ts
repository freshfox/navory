import {TranslateService} from "ng2-translate";
import {Injectable} from "@angular/core";
import {ServiceErrorCode} from "../services/base.service";

@Injectable()
export class ErrorHandler {

	constructor(private translate: TranslateService) {
	}

	getDefaultErrorMessage(code: ServiceErrorCode) {
		switch (code) {
			default:
				return this.translate.instant('general.errors.unexpected');
		}
	}

}
