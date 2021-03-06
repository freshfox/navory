import {Component, OnInit} from "@angular/core";

@Component({
	selector: 'nvry-income',
	template: `
        <div class="page-header page-header--no-side-padding page-header--no-bottom-padding">
            <nav class="tabs tabs--full-width">
                <ul>
                    <li>
                        <a [routerLink]="['/income/invoices']" routerLinkActive="selected">{{ 'invoices.title' | translate }}</a>
                    </li>
                    <li>
                        <a [routerLink]="['/income/other']" routerLinkActive="selected">{{ 'income.other-income' | translate }}</a>
                    </li>
					<li>
						<a [routerLink]="['/income/recurring-invoices']" routerLinkActive="selected">{{ 'recurring-invoices.title' | translate }}</a>
					</li>
				</ul>
            </nav>
        </div>
        <router-outlet></router-outlet>    
`
})
export class IncomeComponent implements OnInit {
	constructor() {
	}

	ngOnInit() {
	}

}
