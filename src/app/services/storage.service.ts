import {Injectable} from "@angular/core";
import {LocalStorageService} from "./local-storage.service";


@Injectable()
export class StorageService {

	constructor(private storage: LocalStorageService) {
	}

}
