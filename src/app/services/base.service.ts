import {Injectable, Injector} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment';
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

	patch(url: string, data: any): Observable<any> {
	    return this.http.patch(this.constructApiUrl(url), data, this.defaultHttpOptions)
            .map(this.extract)
            .catch(this.handleError)
    }

	private handleError(error: any) {
	    let body = JSON.parse(error._body);
	    var errCode = error.status;

        switch(error.status) {
            case 400:
                errCode = 'VALIDATION_ERROR';
                break;
            case 401:
                errCode = 'UNAUTHORIZED';
                break;
            default:
                errCode = 'UNEXPECTED_SERVER_ERROR';
                break;
        }

        return Observable.throw({
            code: errCode,
            message: body.message,
            data: body.errors || null
        });

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
