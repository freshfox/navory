import {Injectable} from "@angular/core";
import * as moment from 'moment';
import {Config} from "./config";

@Injectable()
export class Formatter {

	formatDateForApi(date): string {
		return moment(date).format(Config.apiDateFormat);
	}

}




