import {of, Observable} from 'rxjs';
import {TranslateLoader} from '@ngx-translate/core';


import de from '../i18n/de.json';

export class TranslatePackagedLoader implements TranslateLoader {

	getTranslation(lang: string): Observable<any> {
		return of(de);
	}

}

export function translatePackagedLoaderFactory() {
	return new TranslatePackagedLoader();
}
