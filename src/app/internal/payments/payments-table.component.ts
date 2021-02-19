import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	OnInit,
	ViewChild,
	EventEmitter, Output
} from '@angular/core';
import {PaymentService} from '../../services/payment.service';
import {Payment} from '../../models/payment';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '../../core/pipes/date.pipe';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {State} from '../../core/state';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {DialogService, DialogType} from '@freshfox/ng-core';
import {BookPaymentListComponent} from './book-payment-list.component';
import {MatSort} from '@angular/material/sort';

@Component({
	selector: 'nvry-payments-table',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="pb-4 px-6">
			<mat-checkbox [ngModel]="state.showBookedPayments$ | async"
						  (ngModelChange)="state.showBookedPayments$.next($event)">Abgeglichene anzeigen
			</mat-checkbox>
		</div>
		<table mat-table [dataSource]="dataSource" matSort style="width: 100%;" matSortActive="date" matSortDirection="desc" class="payments-table ff-table-clickable">
			<ng-container matColumnDef="status">
				<th mat-header-cell *matHeaderCellDef>Status</th>
				<td mat-cell *matCellDef="let element">
					<ff-badge [size]="'small'" [type]="getBadgeTypeForPayment(element)">{{ getBadgeTitleForPayment(element) }}</ff-badge>
				</td>
			</ng-container>

			<ng-container matColumnDef="description">
				<th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'general.description' | translate }}</th>
				<td mat-cell *matCellDef="let element"> {{element.description}} </td>
			</ng-container>

			<ng-container matColumnDef="date">
				<th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'general.date' | translate }}</th>
				<td mat-cell *matCellDef="let element"> {{element.date | date }} </td>
			</ng-container>

			<ng-container matColumnDef="link">
				<th mat-header-cell *matHeaderCellDef mat-sort-header>Gebucht auf</th>
				<td mat-cell *matCellDef="let element">
					<a (click)="$event.stopImmediatePropagation()" [routerLink]="link.path" *ngFor="let link of linksForPayment(element)" class="text-primary truncate block">{{ link.name }}</a>
				</td>
			</ng-container>

			<ng-container matColumnDef="amount">
				<th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'general.amount' | translate }}</th>
				<td mat-cell *matCellDef="let element" class="text-right">
					<div class="flex space-x-2 justify-end">
						<span class="text-gray-400" *ngIf="element.remaining_amount !== 0 && element.remaining_amount !== element.amount">({{ element.remaining_amount | currency }} übrig)</span>
						<span [class.text-green-600]="element.amount >= 0"
							  [class.text-red-600]="element.amount < 0">{{ element.amount | ffNumber }}</span>
					</div>
				</td>
			</ng-container>

			<ng-container matColumnDef="actions">
				<th mat-header-cell *matHeaderCellDef></th>
				<td mat-cell *matCellDef="let element">
					<div class="flex items-center space-x-2">
						<button mat-button color="primary">Rechnung</button>
						<button mat-button color="primary">Ausgabe</button>
					</div>
				</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
			<tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="rowClicked(row)"></tr>
		</table>
		<mat-paginator [length]="dataSource?.data.length"
					   [pageSizeOptions]="[25, 50, 100]" [pageSize]="50" showFirstLastButtons>
		</mat-paginator>
	`,
})
export class PaymentsTableComponent implements OnInit, OnChanges {

	@Input() private payments: Payment[];
	@Output() refresh = new EventEmitter();
	loading: boolean = false;

	displayedColumns = ['status', 'description', 'link', 'date', 'amount'];

	dataSource = new MatTableDataSource<Payment>();
	PaymentStatus = PaymentStatus;

	private payments$ = new BehaviorSubject<Payment[]>([]);

	@ViewChild(MatPaginator, {static: true}) set paginator(paginator: MatPaginator) {
		if (paginator) {
			this.dataSource.paginator = paginator;
		}
	}

	@ViewChild(MatSort, {static: true}) set sort(sort: MatSort) {
		if (sort) {
			this.dataSource.sort = sort;
		}
	}

	constructor(private paymentService: PaymentService,
				private translate: TranslateService,
				private datePipe: DatePipe,
				public state: State,
				private dialog: DialogService,
				private cdr: ChangeDetectorRef) {
		combineLatest([this.payments$, this.state.showBookedPayments$])
			.pipe(map(([payments, showBooked]) => {
				if (showBooked) {
					return payments;
				}

				return payments.filter(p => this.getPaymentStatus(p) !== PaymentStatus.Booked);
			}))
			.subscribe(payments => {
				this.dataSource.data = payments;
				this.cdr.markForCheck();
			});
	}

	ngOnInit() {
	}

	ngOnChanges() {
		this.payments$.next(this.payments);
	}

	deletePayment(payment) {
		const ref = this.dialog.createConfirmRequest(
			this.translate.instant('payments.delete-confirm-title'),
			this.translate.instant('payments.delete-confirm-message'),
			null,
			null,
			DialogType.Danger)
			.subscribe((confirmed) => {
				if (confirmed) {
					let index = this.payments.indexOf(payment);
					this.payments.splice(index, 1);
					this.paymentService.deletePayment(payment).subscribe();
				}
			})
	}

	rowClicked(payment: Payment) {
		if (this.getPaymentStatus(payment) === PaymentStatus.Booked || payment.amount === 0) {
			return;
		}

		const ref = this.dialog.create(BookPaymentListComponent, {
			width: '100%',
			panelClass: 'nvry-dialog-full',
			parameters: {
				payment: payment,
				type: payment.amount > 0 ? 'income' : 'expenses',
			}
		});

		ref.componentInstance.complete
			.pipe(first())
			.subscribe(() => {
				ref.close();
				this.refresh.emit();
			});
	}

	getBadgeTitleForPayment(payment: Payment) {
		switch (this.getPaymentStatus(payment)) {
			case PaymentStatus.Booked:
				return 'Abgeglichen';
			case PaymentStatus.Open:
				return 'Offen';
			case PaymentStatus.PartialBooked:
				return 'Teilbuchung';
		}
	}

	getBadgeTypeForPayment(payment: Payment) {
		switch (this.getPaymentStatus(payment)) {
			case PaymentStatus.Booked:
				return 'success';
			case PaymentStatus.Open:
				return 'info_alt';
			case PaymentStatus.PartialBooked:
				return 'warn';
		}
	}

	getPaymentStatus(payment: Payment): PaymentStatus {
		if (payment.remaining_amount === 0) {
			return PaymentStatus.Booked;
		}

		if (payment.remaining_amount !== payment.amount) {
			return PaymentStatus.PartialBooked
		}

		return PaymentStatus.Open;
	}

	linksForPayment(payment: Payment): PaymentLink[] {
		const links: PaymentLink[] = [];
		if (payment.invoices) {
			for (const invoice of payment.invoices) {
				links.push({
					name: `Rechnung ${invoice.number}`,
					path: `/income/invoices/${invoice.id}`
				});
			}
		}

		if (payment.expenses) {
			for (const expense of payment.expenses) {
				links.push({
					name: expense.description,
					path: `/expenses/${expense.id}`
				});
			}
		}

		if (payment.incomes) {
			for (const income of payment.incomes) {
				links.push({
					name: income.description,
					path: `/income/other/${income.id}`
				});
			}
		}

		return links;
	}
}

interface PaymentLink {
	path: string;
	name: string;
}

enum PaymentStatus {
	Booked = 'booked',
	PartialBooked = 'partial_booked',
	Private = 'private',
	Open = ' open',
}
