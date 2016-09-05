import {Injectable, Injector} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {environment} from '../environments/environment';
import {Observable} from "rxjs";

@Injectable()
export class BaseService {

	protected baseUrl: string;

    private defaultHttpOptions = { withCredentials: true };

	constructor(private http: Http) {
	    this.baseUrl = environment.apiUrl;
    }

	get(url: string): Observable<any> {
	    return this.http.get(this.constructApiUrl(url), this.defaultHttpOptions)
            .map(this.extract)
            .catch(this.handleError);
    }

	post(url: string, data: any): Observable<any> {
        return this.http.post(this.constructApiUrl(url), data, this.defaultHttpOptions)
            .map(this.extract)
            .catch(this.handleError);
	}

	private handleError(error: any) {
	    var errMsg = error.status;

        let status = error.status;
	    if (error.status >= 500) {
            errMsg = 'UNEXPECTED_SERVER_ERROR';
        }
        else if (status === 401) {
            errMsg = 'UNAUTHORIZED';
        }

        return Observable.throw(errMsg);

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
