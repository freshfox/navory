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

	protected get(url: string): Observable<any> {
	    return this.http.get(this.constructApiUrl(url), this.defaultHttpOptions)
            .map(this.extract)
            .catch(this.handleError);
    }

	protected post(url: string, data: any): Observable<any> {
        return this.http.post(this.constructApiUrl(url), data, this.defaultHttpOptions)
            .map(this.extract)
            .catch(this.handleError);
	}

    protected put(url: string, data: any): Observable<any> {
        return this.http.put(this.constructApiUrl(url), data, this.defaultHttpOptions)
            .map(this.extract)
            .catch(this.handleError)
    }

	protected patch(url: string, data: any): Observable<any> {
	    return this.http.patch(this.constructApiUrl(url), data, this.defaultHttpOptions)
            .map(this.extract)
            .catch(this.handleError)
    }

    protected delete(url: string): Observable<any> {
        return this.http.delete(this.constructApiUrl(url), this.defaultHttpOptions)
            .map(this.extract)
            .catch(this.handleError)
    }

	private handleError(error: any) {
        let body = null;
        try {
            body = JSON.parse(error._body);
        } catch(error) {}

	    var errCode = error.status;

        switch(error.status) {
            case 400:
                errCode = ServiceErrorCode.ValidationError;
                break;
            case 401:
                errCode = ServiceErrorCode.Unauthorized;
                break;
            case 503:
                errCode = ServiceErrorCode.ServiceUnavailable;
                break;
            default:
                errCode = ServiceErrorCode.Unexpected;
                break;
        }

        return Observable.throw({
            code: errCode,
            message: body ? body.message : null,
            data: body ? body.errors : null
        } as ServiceError);

    }

    private extract(res: Response): any {
        if (res.status != 204) {
            var body;
            try {
                body = res.json()
            } catch(error) {
                body = null;
            }
            return body;
        }
        return null
    }

	constructApiUrl(url: string) {
		return this.baseUrl + url;
	}

	getRestEntityPath(path: string, id: number) {
        return `${path}/${id}`;
    }

}

export enum ServiceErrorCode {
    ValidationError = 'VALIDATION_ERROR' as any,
    Unauthorized = 'UNAUTHORIZED' as any,
    ServiceUnavailable = 'SERVICE_UNAVAILABLE' as any,
    Unexpected = 'UNEXPECTED_SERVER_ERROR' as any
}

export enum FieldValidationError {
    NotUnique = 'NOT_UNIQUE' as any
}

export class ServiceError {
    code: ServiceErrorCode;
    message?: string;
    data?: any;
}
