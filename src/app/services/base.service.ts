import {Injectable, Injector} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {environment} from '../environments/environment';

@Injectable()
export class BaseService {

	protected baseUrl: string;

	constructor(private http: Http) {
	    this.baseUrl = environment.apiUrl;
    }

	get(url: string): Promise<any> {
		return this.http.get(this.constructApiUrl(url))
            .toPromise()
            .then(this.extract);
	}

	post(url: string, data: any): Promise<any> {
        return this.http.post(this.constructApiUrl(url), data)
            .toPromise()
            .then(this.extract);
	}

    private extract(res: Response): any {
        if (res.status != 204) {
            let body = res.json();
            return body || null;
        }
        return null
    }

	private constructApiUrl(url: string) {
		return this.baseUrl + url;
	}

}
