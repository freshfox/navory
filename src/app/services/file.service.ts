import {BaseService} from "./base.service";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {File} from "../models/file";

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

    downloadFile(file: File) {
        let path = `${this.pathFile}/${file.id}/download`;
        let fullPath = this.constructApiUrl(path);

        //Creating new link node.
        var link = document.createElement('a');
        link.href = fullPath;

        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1, fullPath.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }

        window.open(fullPath, '_blank');
    }
}
