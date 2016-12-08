import {Component, OnInit} from "@angular/core";
import {Input} from "@angular/core/src/metadata/directives";

@Component({
	selector: 'nvry-spinner',
	template: `
        <md-progress-circle [mode]="progress ? 'determinate' : 'indeterminate'" [value]="progress">`
})
export class SpinnerComponent implements OnInit {

	@Input() progress: number;

	constructor() {
	}

	ngOnInit() {
	}

}
