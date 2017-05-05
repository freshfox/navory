import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'nvry-reports',
	template: `
		<div class="page-header page-header--no-side-padding page-header--no-bottom-padding">
			<nav class="tabs tabs--full-width">
				<ul>
					<li>
						<a [routerLink]="['/reports/vat']" routerLinkActive="selected">{{ 'reports.vat' | translate }}</a>
					</li>
					<li>
						<a [routerLink]="['/reports/profit-loss']" routerLinkActive="selected">{{ 'reports.profit-loss' | translate }}</a>
					</li>
				</ul>
			</nav>
		</div>
		<router-outlet></router-outlet>
	
	`
})
export class ReportsComponent implements OnInit {
	constructor() {
	}

	ngOnInit() {
	}
}
