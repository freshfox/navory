import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {EuVatType} from "../core/enums/eu-vat-type.enum";
import {TranslateService} from "ng2-translate";

@Injectable()
export class BootstrapService extends BaseService {

    private pathBootstrap = '/bootstrap';

    constructor(http: Http, private translate: TranslateService) {
        super(http);
    }

    getBootstrapData(): Observable<any> {
        return this.get(this.pathBootstrap);
    }

    getFormattedEuVatTypes() {
        return [
            {
                name: this.translate.instant('income.edit.intra-community-none'),
                value: EuVatType.None
            },
            {
                name: this.translate.instant('income.edit.intra-community-service'),
                value: EuVatType.ReverseCharge
            },
            {
                name: this.translate.instant('income.edit.intra-community-product'),
                value: EuVatType.IntraCommunityAcquisition
            }
        ];
    }

}
