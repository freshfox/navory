import {Injectable} from "@angular/core";
import {BaseService} from "./base.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {State} from "../core/state";
import {Unit} from "../models/unit";

@Injectable()
export class UnitService extends BaseService {


	constructor(http: Http, private state: State) {
		super(http);
	}

	getUnit(id: number): Observable<Unit> {
		let units = this.state.units;
		let unit = null;
		units.forEach(currentUnit => {
			if (currentUnit.id == id) {
				unit = currentUnit;
			}
		});

		return Observable.of(unit);
	}

}
