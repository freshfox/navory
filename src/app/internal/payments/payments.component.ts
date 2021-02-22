import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PaymentService} from '../../services/payment.service';
import {BankAccount} from '../../models/bank-account';
import {DialogService} from '@freshfox/ng-core';
import {BankAccountCreateComponent} from './bank-account-create.component';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {Payment} from '../../models/payment';
import {first, map, startWith, switchMap, tap} from 'rxjs/operators';
import {PaymentImportComponent} from './payment-import.component';

@Component({
	selector: 'nvry-payments',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex items-center">
			<div class="flex space-x-6 p-6">
				<div *ngFor="let account of bankAccounts$ | async"
					 class="relative cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-3 shadow-sm flex items-center space-x-3 hover:border-gray-400 hover:bg-gray-100"
					 [ngClass]="{ 'ring-2 ring-blue-600': account.id === (selectedBankAccountId$ | async) }"
					 (click)="selectedBankAccountId$.next(account.id)">
					<div class="flex-shrink-0 h-6 w-6 text-gray-600">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							 *ngIf="account.manual">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
						</svg>

						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							 *ngIf="!account.manual">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
						</svg>
					</div>
					<div class="flex-1 min-w-0">
						<span class="absolute inset-0" aria-hidden="true"></span>
						<p class="text-md font-medium text-gray-900">
							{{ account.name }}
						</p>
					</div>
				</div>
			</div>

			<div class="ml-auto">
				<button ff-button class="ff-button--secondary" (click)="addBankAccount()">Neues Konto</button>
			</div>
		</div>

		<nvry-payments-table [payments]="payments" *ngIf="payments$ | async as payments"
							 (refresh)="refresh$.next()">

			<button ff-button *ngIf="!!(selectedBankAccount$ | async)?.manual === false" (click)="startImport()">
				CSV Import
			</button>
		</nvry-payments-table>
		<ff-spinner *ngIf="loading$ | async"></ff-spinner>
	`,
})
export class PaymentsComponent implements OnInit {

	bankAccounts$ = new BehaviorSubject<BankAccount[]>([]);
	selectedBankAccountId$ = new BehaviorSubject<number>(null);
	loading$ = new BehaviorSubject(false);

	selectedBankAccount$: Observable<BankAccount>;

	payments$: Observable<Payment[]>;

	refresh$ = new Subject();
	refreshBankAccounts$ = new Subject();

	constructor(private paymentService: PaymentService, private cdr: ChangeDetectorRef, private dialog: DialogService) {
	}

	ngOnInit() {
		this.payments$ = this.refresh$.pipe(startWith(null))
			.pipe(tap(() => {
				this.loading$.next(true);
			}))
			.pipe(switchMap(() => {
				return combineLatest([this.paymentService.getPayments(), this.bankAccounts$, this.selectedBankAccountId$])
			}))
			.pipe(map(([payments, accounts, selectedBankAccountId]) => {
				this.loading$.next(false);
				return payments.filter(p => {
					if (p.description === 'Zahlung für Ausgabe 13') {
						console.log(p);
					}
					return p.bank_account_id === selectedBankAccountId
				});
			}));

		this.refreshBankAccounts$.pipe(startWith(null))
			.pipe(switchMap(() => {
				return this.paymentService.getBankAccounts()
			}))
			.subscribe(bankAccounts => {
				this.bankAccounts$.next(bankAccounts);
				if (!this.selectedBankAccountId$.value) {
					this.selectedBankAccountId$.next(bankAccounts[0].id);
				}
			});

		this.selectedBankAccount$ = combineLatest([this.selectedBankAccountId$, this.bankAccounts$])
			.pipe(map(([id, accounts]) => {
				console.log(id, accounts);
				return accounts?.find(a => a.id === id) || null;
			}));
	}

	addBankAccount() {
		const ref = this.dialog.create(BankAccountCreateComponent);

		ref.componentInstance.cancelClick
			.pipe(first())
			.subscribe(() => {
				ref.close();
			});

		ref.componentInstance.success
			.pipe(first())
			.subscribe(() => {
				this.refreshBankAccounts$.next();
				ref.close();
			});
	}

	startImport() {
		const ref = this.dialog.create(PaymentImportComponent, {
			parameters: {
				bankAccountId: this.selectedBankAccountId$.value,
			}
		});

		ref.componentInstance.success
			.pipe(first())
			.subscribe(() => {
				ref.close();
				this.refresh$.next();
			});
	}
}
