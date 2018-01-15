import {Component, OnInit} from '@angular/core';
import {AlertBarType} from '../../core/components/alert-bar.component';
import {AccountService} from '../../services/account.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'nvry-annual-accounts',
	template: `		
		<section class="settings-section settings-section--no-border export-section">
			<div class="frame">
				<div class="bit-25">
					<h3>{{ 'settings.annual-accounts.title' | translate }}</h3>
				</div>
				<div class="bit-75">
					<p>{{ 'settings.annual-accounts.description' | translate }}</p>

					<ff-alert-bar [message]="alertMessage" [type]="alertType"></ff-alert-bar>
					<div class="export-fields">
						<ff-select [options]="years" [label]="'general.year' | translate"
								   [enableSearchField]="false" [(selectedValue)]="selectedYear"></ff-select>

						<button ff-button (click)="export()" [loading]="loading">{{ 'settings.annual-accounts.submit' | translate }}
						</button>
					</div>
				</div>
			</div>
		</section>
	`
})

export class AnnualAccountsComponent implements OnInit {

	years: number[];
	alertMessage: string;
	alertType = AlertBarType.Success;
	loading = false;

	selectedYear: number;

	constructor(private accountService: AccountService, private translate: TranslateService) {
	}

	ngOnInit() {
		this.years = this.getYears();
		this.selectedYear = new Date().getFullYear();
	}

	getYears() {
		const years: any[] = [];
		const startYearDate = new Date();
		startYearDate.setFullYear(startYearDate.getFullYear() - 10);

		let startYear = startYearDate.getFullYear();
		const currentYear = new Date().getFullYear();

		while ( startYear <= currentYear ) {
			years.push({ id: startYear++ });
		}

		return years;
	}

	export() {
		this.loading = true;
		this.accountService.downloadAnnualAccountsExport(parseInt(this.selectedYear + ''))
			.subscribe(() => {
				this.loading = false;
				this.alertMessage = this.translate.instant('settings.annual-accounts.success-message');
			})
	}
}
