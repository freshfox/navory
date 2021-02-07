import { Injectable } from "@angular/core";
@Injectable()
export class Config {

	static minPasswordLength: number = 8;
	static apiDateFormat: string = 'YYYY-MM-DD';
	static defaultUnitId: number = 1;

}
