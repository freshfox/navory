import {TranslateService} from "ng2-translate";
import {Injectable} from "@angular/core";

@Injectable()
export class ErrorHandler {

    constructor(private translate: TranslateService) {
    }

    getDefaultErrorMessage(code: string) {
        switch(code) {
            case 'UNEXPECTED_SERVER_ERROR':
                return this.translate.instant('general.errors.unexpected');
        }

        return '';
    }

}
