import {Injectable} from "@angular/core";
import {Storage} from "../core/storage";


@Injectable()
export class StorageService {

	constructor(private storage: Storage) {
	}

}
