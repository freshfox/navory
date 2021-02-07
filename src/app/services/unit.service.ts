import {Injectable} from '@angular/core';
import {ApiService} from '@freshfox/ng-core';
import {Observable, of} from 'rxjs';
import {State} from '../core/state';
import {Unit} from '../models/unit';

@Injectable()
export class UnitService {


	constructor(private apiService: ApiService, private state: State) {

	}

	getUnit(id: number): Observable<Unit> {
		let units = this.state.units;
		let unit = null;
		units.forEach(currentUnit => {
			if (currentUnit.id == id) {
				unit = currentUnit;
			}
		});

		return of(unit);
	}

}
