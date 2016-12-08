import {Pipe, PipeTransform} from "@angular/core";
import {Formatter} from "../formatter";

@Pipe({name: 'nvryNumber'})
export class NumberPipe implements PipeTransform {

	constructor(private formatter: Formatter) {
	}

	transform(value: number, numberOfDecimals: number = 2): string {
		return this.formatter.money(value, numberOfDecimals);
	}
}
