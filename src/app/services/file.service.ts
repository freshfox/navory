import {BaseService} from "./base.service";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class FileService extends BaseService {

    private pathFile = '/files';

    constructor(http: Http) {
        super(http);
    }

    getFile(id: number) {
        let path = this.pathFile + `/${id}`;
        return this.get(path);
    }
}
