import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {PaymentService} from '../../services/payment.service';
import {FormControl} from '@angular/forms';
import {Payment} from '../../models/payment';
import {switchMap} from 'rxjs/operators';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {SnackBarService} from '@freshfox/ng-core';

@Component({
	selector: 'nvry-payment-import',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="px-4 py-6">
			<h2 class="text-xl font-semibold mb-2">Bank Transaktionen importieren <span
				class="text-gray-500">(BETA)</span></h2>
			<p class="mb-4">
				Der Import von Banktranskationen befindet sich derzeit noch in Entwicklung. Momentan müssen folgende
				Bedingungen gelten.
			</p>

			<h3 class="text-lg font-semibold">Spalten:</h3>
			<ol class="list-decimal pl-4 mb-6">
				<li>Datum <span class="text-gray-500">(YYYY-MM-DD)</span></li>
				<li>Beschreibung</li>
				<li>Betrag <span class="text-gray-500">Punkt als Dezimalzeichen (z.B. 14.90)</span></li>
			</ol>

			<div class="mb-6">
				<input type="file" (change)="fileChanged($event)">
			</div>

			<p class="text-gray-500">Zeilen die exakt gleich sind, werden nicht doppelt importiert.</p>
		</div>
		<div class="ff-dialog-footer">
			<button ff-button [loading]="importing$ | async" [disabled]="!file" (click)="upload()">Importieren</button>
		</div>
	`
})
export class PaymentImportComponent implements OnInit {

	@HostBinding('class') clazz = 'nvry-payment-import';

	file: File;

	uploadFormControl = new FormControl();

	importing$ = new BehaviorSubject(false);

	@Input() bankAccountId: number;
	@Output() success = new EventEmitter();

	constructor(private paymentService: PaymentService, private snackbar: SnackBarService) {
	}

	ngOnInit() {
	}

	fileChanged(event) {
		this.file = event.target.files[0];
	}

	upload() {
		this.paymentService.importCsv(this.file)
			.pipe(switchMap(result => {
				const tasks = [];
				for (const row of result.rows) {
					const payment = new Payment();
					payment.date = row[0];
					payment.description = row[1];
					payment.amount = row[2];
					tasks.push(this.paymentService.createPayment(payment, this.bankAccountId));
				}

				return forkJoin(tasks);
			}))
			.subscribe(() => {
				this.snackbar.success('Zahlungen erfolgreich importiert');
				this.success.emit();
			}, () => {
				this.snackbar.error('Fehler beim Importieren der Zahlungen');
			});
	}
}
