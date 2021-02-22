import {ChangeDetectionStrategy, Component, HostBinding, OnInit, Output, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {PaymentService} from '../../services/payment.service';
import {SnackBarService} from '@freshfox/ng-core';

@Component({
	selector: 'nvry-bank-account-create',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="px-6 py-5">
			<h3 class="text-xl leading-6 font-medium text-gray-900 mb-4 dark:text-white">
				Konto erstellen
			</h3>

			<ff-input [(ngModel)]="name" [label]="'general.name' | translate"></ff-input>

			<div class="relative flex items-start">
				<div class="absolute flex items-center h-5">
					<mat-checkbox [(ngModel)]="manual" id="manual"></mat-checkbox>
				</div>
				<div class="pl-7 text-sm">
					<label for="manual" class="font-medium text-gray-900">
						Manuelles Konto
					</label>
					<p class="text-gray-500">
						Wähle diese Option um Zahlungen manuell zu verwalten, anstatt zu importieren.
					</p>
				</div>
			</div>

		</div>
		<div class="bg-gray-50 px-6 py-3 flex space-x-3 justify-end">
			<button ff-button class="ff-button--secondary" (click)="close()">Abbrechen</button>
			<button ff-button [loading]="loading$ | async" (click)="save()">Anlegen</button>
		</div>
	`
})
export class BankAccountCreateComponent implements OnInit {

	@HostBinding('class') clazz = 'nvry-bank-account-create';

	@Output() cancelClick = new EventEmitter();
	@Output() success = new EventEmitter();

	loading$ = new BehaviorSubject(false);

	name: string;
	manual = false;

	constructor(private paymentService: PaymentService, private snackbar: SnackBarService) {
	}

	ngOnInit() {
	}

	close() {
		this.cancelClick.emit();
	}

	save() {
		this.loading$.next(true);
		this.paymentService.createBankAccount({
			name: this.name,
			manual: this.manual,
		}).subscribe(() => {
			this.loading$.next(false);
			this.success.emit();
		}, () => {
			this.loading$.next(false);
			this.snackbar.error('Konto konnte nicht erstellt werden.');
		});
	}
}
