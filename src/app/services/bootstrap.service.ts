import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class BootstrapService extends BaseService {

    private pathBootstrap = '/bootstrap';

    constructor(http: Http) {
        super(http);
    }

    getBootstrapData(): Observable<any> {
        return this.get(this.pathBootstrap);
    }

}
