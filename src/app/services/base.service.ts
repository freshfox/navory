
import {throwError as observableThrowError, Observable} from 'rxjs';
import {Injectable, EventEmitter} from "@angular/core";
import {Http, Response} from "@angular/http";
import {environment} from "../../environments/environment";
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class NavoryApi {

	protected baseUrl: string;

	private defaultHttpOptions = {withCredentials: true};

	static onUnauthorized: EventEmitter<String> = new EventEmitter<String>();

	constructor(private http: Http) {
		this.baseUrl = environment.apiUrl;
	}

	protected get(url: string, params?: any): Observable<any> {
		return this.http.get(this.constructApiUrl(url), Object.assign({ search: params }, this.defaultHttpOptions))
			.pipe(map(this.extract), catchError(this.handleError));
	}

	protected post(url: string, data: any): Observable<any> {
		return this.http.post(this.constructApiUrl(url), data, this.defaultHttpOptions)
			.pipe(map(this.extract), catchError(this.handleError));
	}

	protected put(url: string, data: any): Observable<any> {
		return this.http.put(this.constructApiUrl(url), data, this.defaultHttpOptions)
			.pipe(map(this.extract), catchError(this.handleError));
	}

	protected patch(url: string, data: any): Observable<any> {
		return this.http.patch(this.constructApiUrl(url), data, this.defaultHttpOptions)
			.pipe(map(this.extract), catchError(this.handleError));
	}

	protected delete(url: string): Observable<any> {
		return this.http.delete(this.constructApiUrl(url), this.defaultHttpOptions)
			.pipe(map(this.extract), catchError(this.handleError));
	}

	private handleError(error: any) {
		let body = null;
		try {
			body = JSON.parse(error._body);
		} catch (error) {
		}

		var errCode = error.status;

		switch (error.status) {
			case 400:
				errCode = ServiceErrorCode.ValidationError;
				break;
			case 401:
				errCode = ServiceErrorCode.Unauthorized;
				NavoryApi.onUnauthorized.emit();
				break;
			case 403:
				errCode = ServiceErrorCode.Forbidden;
				break;
			case 503:
				errCode = ServiceErrorCode.ServiceUnavailable;
				break;
			default:
				errCode = ServiceErrorCode.Unexpected;
				break;
		}

		return observableThrowError({
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
			} catch (error) {
				body = null;
			}
			return body;
		}
		return null
	}

	constructApiUrl(url: string) {
		return this.baseUrl + url;
	}

	getRestEntityPath(path: string, id: string | number) {
		return `${path}/${id}`;
	}

}

export enum ServiceErrorCode {
	ValidationError = 'VALIDATION_ERROR' as any,
	Unauthorized = 'UNAUTHORIZED' as any,
	ServiceUnavailable = 'SERVICE_UNAVAILABLE' as any,
	Unexpected = 'UNEXPECTED_SERVER_ERROR' as any,
	Forbidden = 'FORBIDDEN' as any,
}

export enum FieldValidationError {
	NotUnique = 'NOT_UNIQUE' as any
}

export class ServiceError {
	code: ServiceErrorCode;
	message?: string;
	data?: any;
}
