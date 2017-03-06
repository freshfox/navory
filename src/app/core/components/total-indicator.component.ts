import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'nvry-total-indicator',
	template: `
		<div class="line">
			<span class="title">Zwischensumme</span>
			<span class="value">{{ totalNet | nvryNumber }}</span>
		</div>

		<div class="line" *ngFor="let rate of rates">
			<span class="title">USt. {{ rate.rate }}% von {{ rate.netAmount | nvryNumber }}</span>
			<span class="value">{{ rate.amount | nvryNumber}}</span>
		</div>

		<div class="line line--total">
			<span class="title">Gesamt EUR</span>
			<span class="value">{{ totalGross | nvryNumber }}</span>
		</div>
	`,
	host: { 'class': 'total-indicator' }
})
export class TotalIndicatorComponent implements OnInit {

	@Input() totalNet: number;
	@Input() totalGross: number;
	@Input() rates: any[];

    constructor() { }

    ngOnInit() { }

}
