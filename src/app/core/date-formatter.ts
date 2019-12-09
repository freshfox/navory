import moment from 'moment';
import {Config} from './config';

export class DateFormatter {

	static formatDateForApi(date): string {
		return moment(date).format(Config.apiDateFormat);
	}

}




